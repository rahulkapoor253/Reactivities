import { observable, action, computed, configure, runInAction } from "mobx";
import "mobx-react-lite/batchingForReactDom";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/Activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";

configure({ enforceActions: "always" });

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

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
    try {
      const activities = await agent.Activities.list();
      //change of observables below await doesnt fall under action
      runInAction("loading activities", () => {
        activities.forEach((activity: any) => {
          activity.date = new Date(activity.date!);
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
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        const activity = await agent.Activities.details(id);
        runInAction("loading activity", () => {
          activity.date = new Date(activity.date);
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
      runInAction("create activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
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
}
