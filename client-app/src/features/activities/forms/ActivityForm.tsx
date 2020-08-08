import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    activity: initFormState,
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    clearActivity,
  } = activityStore;

  //init with blank and in sync useEffect is called
  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      console.log("fetching activity");
      loadActivity(match.params.id).then(
        () => initFormState && setActivity(initFormState)
      );
    }
    return () => {
      clearActivity();
    };
  }, [loadActivity, match.params.id]);

  const handleSubmitForm = () => {
    console.log(activity);
    if (activity.id.length > 0) {
      //edited activity
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    } else {
      //created new activity
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //able to edit the focussed form input field
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmitForm}>
            <Form.Input
              placeholder="Title"
              onChange={handleInputChange}
              name="title"
              value={activity.title}
            />
            <Form.TextArea
              rows={2}
              placeholder="Description"
              onChange={handleInputChange}
              name="description"
              value={activity.description}
            />
            <Form.Input
              placeholder="Category"
              onChange={handleInputChange}
              name="category"
              value={activity.category}
            />
            <Form.Input
              type="datetime-local"
              placeholder="Date"
              onChange={handleInputChange}
              name="date"
              value={activity.date}
            />
            <Form.Input
              placeholder="City"
              onChange={handleInputChange}
              name="city"
              value={activity.city}
            />
            <Form.Input
              placeholder="Venue"
              onChange={handleInputChange}
              name="venue"
              value={activity.venue}
            />
            <Button
              loading={submitting}
              floated="right"
              positive
              type="submit"
              content="submit"
            />
            <Button
              floated="right"
              type="button"
              content="cancel"
              onClick={() => history.push("/activities")}
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
