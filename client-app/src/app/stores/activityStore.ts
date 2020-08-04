import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/Activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = "";

  //sort activities by date
  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
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
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (err) {
      console.log(err);
      runInAction("loading activities error", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("create activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
      });
    } catch (err) {
      console.log(err);
      runInAction("create activity error", () => {
        this.submitting = false;
      });
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("edit activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (err) {
      console.log(err);
      runInAction("edit activity error", () => {
        this.submitting = false;
      });
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

  @action openEditForm = (id: string) => {
    this.editMode = true;
    this.selectedActivity = this.activityRegistry.get(id);
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
