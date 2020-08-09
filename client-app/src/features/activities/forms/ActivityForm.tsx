import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import Categories from "../../../app/common/form/Categories";

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

  // const handleSubmitForm = () => {
  //   console.log(activity);
  //   if (activity.id.length > 0) {
  //     //edited activity
  //     editActivity(activity).then(() =>
  //       history.push(`/activities/${activity.id}`)
  //     );
  //   } else {
  //     //created new activity
  //     let newActivity = {
  //       ...activity,
  //       id: uuid(),
  //     };
  //     createActivity(newActivity).then(() =>
  //       history.push(`/activities/${activity.id}`)
  //     );
  //   }
  // };

  const handleFinalFormSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  placeholder="Title"
                  component={TextInput}
                  name="title"
                  value={activity.title}
                />
                <Field
                  rows={2}
                  placeholder="Description"
                  name="description"
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder="Category"
                  component={SelectInput}
                  options={Categories}
                  name="category"
                  value={activity.category}
                />
                <Field
                  type="datetime-local"
                  placeholder="Date"
                  component={TextInput}
                  name="date"
                  value={activity.date}
                />
                <Field
                  placeholder="City"
                  component={TextInput}
                  name="city"
                  value={activity.city}
                />
                <Field
                  placeholder="Venue"
                  component={TextInput}
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
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
