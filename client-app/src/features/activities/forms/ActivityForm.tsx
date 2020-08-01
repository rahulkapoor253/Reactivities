import React from "react";
import { Segment, Form } from "semantic-ui-react";

const ActivityForm = () => {
  return (
    <Segment>
      <Form>
        <Form.Input placeholder="Title"></Form.Input>
        <Form.TextArea rows={2} placeholder="Description"></Form.TextArea>
        <Form.Input placeholder="Category"></Form.Input>
        <Form.Input type="date" placeholder="Date"></Form.Input>
        <Form.Input placeholder="City"></Form.Input>
        <Form.Input placeholder="Venue"></Form.Input>
      </Form>
    </Segment>
  );
};

export default ActivityForm;
