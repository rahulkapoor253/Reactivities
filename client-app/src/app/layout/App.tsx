import React, { useState, useEffect, Fragment } from "react";
import agent from "../api/agent";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/Activity";
import NavBar from "../../features/nav/Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter((x) => x.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    agent.Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditActivity = (activity: IActivity) => {
    //filter all activities with unmatching edited activity id and then add it to end
    agent.Activities.update(activity)
      .then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteActivity = (id: string) => {
    agent.Activities.delete(id)
      .then(() => {
        setActivities([...activities.filter((x) => x.id !== id)]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    //fetch data from .netcore api
    agent.Activities.list()
      .then((response) => {
        //reformat datetime
        let activities: IActivity[] = [];
        response.forEach((activity: any) => {
          activity.date = activity.date.split(".")[0];
          activities.push(activity);
        });
        setActivities(activities);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Fragment>
      <NavBar createForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
