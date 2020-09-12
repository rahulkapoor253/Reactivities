import React, { Fragment, useContext, useEffect } from "react";
import { Comment, Segment, Header, Form, Button } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import { formatDistance } from "date-fns";

const ActivityDetailedChat = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    activity,
  } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(activity!.id);
    //incase of component cleanup
    return () => {
      stopHubConnection();
    };
  }, [createHubConnection, stopHubConnection, activity]);

  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity &&
            activity.comments &&
            activity.comments.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>
                      {formatDistance(new Date(comment.createdAt), new Date())}
                    </div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
        </Comment.Group>

        <FinalForm
          onSubmit={addComment}
          render={({ handleSubmit, submitting, form }) => (
            <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
              <Field
                name="body"
                component={TextAreaInput}
                placeholder="Add comment"
              />
              <Button
                content="Add Reply"
                labelPosition="left"
                icon="edit"
                primary
                loading={submitting}
              />
            </Form>
          )}
        />
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedChat);
