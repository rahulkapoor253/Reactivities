import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/models/Activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import Categories from "../../../app/common/form/Categories";
import DateInput from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/utils/util";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "../../../app/stores/rootStore";

const validate = combineValidators({
  title: isRequired({ message: "Event title is required" }),
  category: isRequired("Category"),
  description: isRequired("Description"),
  city: isRequired("City"),
  venue: isRequired("Venue"),
  date: isRequired("Date"),
  time: isRequired("Time"),
});

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    submitting,
    loadActivity,
    createActivity,
    editActivity,
  } = rootStore.activityStore;

  //init with blank and in sync useEffect is called
  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //if page is called from url and no activity is present, fire getactivitybyid call
    if (match.params.id) {
      setLoading(true);
      console.log("fetching activity");
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    //combine date and time with utils
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    console.log(activity.date);
    if (activity.id) {
      //edited activity
      console.log("editing activity");
      editActivity(activity);
    } else {
      //created new activity
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      console.log("creating activity");
      console.log(newActivity);
      createActivity(newActivity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
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
                <Form.Group>
                  <Field
                    placeholder="Date"
                    component={DateInput}
                    name="date"
                    value={activity.date}
                    date={true}
                  />
                  <Field
                    placeholder="Time"
                    component={DateInput}
                    name="time"
                    value={activity.time!}
                    time={true}
                  />
                </Form.Group>
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
                  disabled={loading || invalid || pristine}
                />
                <Button
                  floated="right"
                  type="button"
                  content="cancel"
                  disabled={loading}
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push("/activities")
                  }
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
