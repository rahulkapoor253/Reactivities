import { observable, action } from "mobx";
import { createContext } from "react";
import { IActivity } from "../models/Activity";
import agent from "../api/agent";

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;

  @action loadActivities = () => {
    //fetch data from .netcore api
    this.loadingInitial = true;
    agent.Activities.list()
      .then((activities) => {
        activities.forEach((activity: any) => {
          activity.date = activity.date.split(".")[0];
          this.activities.push(activity);
        });
      })
      .then(() => {
        this.loadingInitial = false;
      })
      .catch((err) => {
        console.log(err);
        this.loadingInitial = false;
      });
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((x) => x.id === id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
