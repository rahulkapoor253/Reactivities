import { observable, action, computed } from "mobx";
import { createContext } from "react";
import { IActivity } from "../models/Activity";
import agent from "../api/agent";

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;

  //sort activities by date
  @computed get activitiesByDate() {
    return this.activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    //fetch data from .netcore api
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity: any) => {
        activity.date = activity.date.split(".")[0];
        this.activities.push(activity);
        this.loadingInitial = false;
      });
    } catch (err) {
      console.log(err);
      this.loadingInitial = false;
    }
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((x) => x.id === id);
    this.editMode = false;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      this.activities.push(activity);
      this.selectedActivity = activity;
      this.editMode = false;
    } catch (err) {
      console.log(err);
      this.submitting = false;
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };
}

export default createContext(new ActivityStore());
