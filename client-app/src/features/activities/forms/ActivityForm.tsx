import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { v4 as uuid } from "uuid";

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
}

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initFormState,
  createActivity,
  editActivity,
}) => {
  const initForm = () => {
    if (initFormState) {
      return initFormState;
    }
    //else return object with init values
    return {
      id: "",
      title: "",
      description: "",
      category: "",
      date: "",
      city: "",
      venue: "",
    };
  };

  const [activity, setActivity] = useState<IActivity>(initForm);

  const handleSubmitForm = () => {
    console.log(activity);
    if (activity.id.length > 0) {
      //edited activity
      editActivity(activity);
    } else {
      //created new activity
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
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
    <Segment clearing>
      <Form>
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
          floated="right"
          positive
          type="submit"
          content="submit"
          onClick={handleSubmitForm}
        />
        <Button
          floated="right"
          type="button"
          content="cancel"
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
