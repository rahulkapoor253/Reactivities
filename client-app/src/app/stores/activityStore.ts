import {
  observable,
  action,
  computed,
  runInAction,
  reaction,
  toJS,
} from "mobx";
import "mobx-react-lite/batchingForReactDom";
import { SyntheticEvent } from "react";
import { IActivity, IAttendee } from "../models/Activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { IUser } from "../models/user";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

const LIMIT = 2;

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    //add reaction on change of filters
    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        //clear the previous filter based activities and load new data based on filter change
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable activityCount = 0;
  @observable page = 0;
  //key value pair for all params to fetch filtered activities
  @observable predicate = new Map();

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate !== "all") {
      this.predicate.set(predicate, value);
    }
  };

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  //signalR hub action to make a connection to hub
  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    //start the connection
    this.hubConnection
      .start()
      .then(() => {
        console.log(this.hubConnection!.state);
      })
      .then(() => {
        console.log("Attempting to join the group");
        this.hubConnection?.invoke("AddToGroup", activityId);
      })
      .catch((err) => {
        console.log("Error establishing connection to Hub " + err);
      });

    //all users polling this will get the comment data added to that activity;
    this.hubConnection.on("ReceiveComment", (comment) => {
      console.log(comment);
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });

    this.hubConnection.on("Send", (message) => {
      toast.info(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke("RemoveFromGroup", this.activity!.id)
      .then(() => {
        this.hubConnection!.stop();
      })
      .then(() => {
        console.log("hub connection stopped");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  @action addComment = async (values: any) => {
    values.ActivityId = this.activity!.id;
    try {
      await this.hubConnection!.invoke("SendComment", values);
    } catch (err) {
      console.log(err);
    }
  };

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivitiesByDate = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return Object.entries(
      //we want to group on the date as key and same date activity as values
      sortedActivitiesByDate.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  //sort activities by date
  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  @action loadActivities = async () => {
    //fetch data from .netcore api
    this.loadingInitial = true;
    const user = this.rootStore.userStore.user!;
    try {
      //rather than passing limit, offset, filter we pass SearchParams object
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      //change of observables below await doesnt fall under action
      runInAction("loading activities", () => {
        //set activity count
        this.activityCount = activitiesEnvelope.activityCount;
        //map activites inside envelope
        activitiesEnvelope.activities.forEach((activity: IActivity) => {
          activity.date = new Date(activity.date!);
          activity.isGoing = activity.Attendees.some(
            (x) => x.username === user.username
          );
          activity.isHost = activity.Attendees.some(
            (x) => x.username === user.username && x.isHost
          );
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
      //console.log(this.groupActivitiesByDate(activities));
    } catch (err) {
      console.log(err);
      runInAction("loading activities error", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    //fetch activity based on id
    //1. via view on activities page when registry is set
    //2. directly via url when registry isnt set, so get data from API
    let activity = this.getActivity(id);
    const user = this.rootStore.userStore.user!;
    if (activity) {
      this.activity = activity;
      //we dont want to return observable activity object;
      return toJS(activity);
    } else {
      this.loadingInitial = true;
      try {
        const activity: IActivity = await agent.Activities.details(id);
        runInAction("loading activity", () => {
          activity.date = new Date(activity.date!);
          activity.isGoing = activity.Attendees.some(
            (x) => x.username === user.username
          );
          activity.isHost = activity.Attendees.some(
            (x) => x.username === user.username && x.isHost
          );
          this.activity = activity;
          //to prevent another call to api on manage activity page-> it finds it in registry only now
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (err) {
        runInAction("getting activity error", () => {
          this.loadingInitial = false;
        });
        console.log(err);
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      //local data handling
      const user: IUser = this.rootStore.userStore.user!;
      let attendees = [];
      const attendee: IAttendee = {
        displayName: user.displayName,
        image: user.image!,
        username: user.username,
        isHost: true,
      };
      attendees.push(attendee);
      activity.Attendees = attendees;
      activity.isHost = true;
      activity.comments = [];
      runInAction("create activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (err) {
      runInAction("create activity error", () => {
        this.submitting = false;
      });
      console.log(err.response);
      toast.error("problem submitting data");
    }
  };

  @action openCreateForm = () => {
    this.activity = null;
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("edit activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (err) {
      runInAction("edit activity error", () => {
        this.submitting = false;
      });
      console.log(err.response);
      toast.error("problem submitting data");
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("delete activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (err) {
      console.log(err);
      runInAction("delete activity error", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };

  @action attendActivity = async () => {
    const user: IUser = this.rootStore.userStore.user!;
    const attendee: IAttendee = {
      displayName: user.displayName,
      image: user.image!,
      username: user.username,
      isHost: false,
    };
    this.loading = true;
    //make api call
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        //local data handling
        if (this.activity) {
          this.activity.Attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
      toast.error("problem in attending to activity");
    }
  };

  @action cancelAttendance = async () => {
    const user: IUser = this.rootStore.userStore.user!;
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.Attendees = this.activity.Attendees.filter(
            (x) => x.username !== user.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
      toast.error("problem in cancelling to activity");
    }
  };
}
