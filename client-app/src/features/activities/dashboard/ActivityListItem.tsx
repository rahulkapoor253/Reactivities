import React from "react";
import {
  Item,
  Button,
  SegmentGroup,
  Segment,
  Icon,
  Label,
} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { IActivity } from "../../../app/models/Activity";
import { format } from "date-fns";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

interface IProps {
  activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {
  const host = activity.Attendees.filter((x) => x.isHost)[0];
  return (
    <SegmentGroup>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={host.image || "/assets/user.png"}
            />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <br></br>
              {!activity.isHost && (
                <Item.Description>
                  Hosted by{" "}
                  <Link to={`/profile/${host.username}`}>
                    {host.displayName}
                  </Link>
                </Item.Description>
              )}
              {activity.isHost && (
                <Item.Description>
                  <Label
                    content="You are hosting this activity"
                    color="orange"
                    basic
                  />
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label
                    content="You are going to this activity"
                    color="teal"
                    basic
                  />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {format(activity.date, "h:mm a")}
        <Icon name="marker" /> {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.Attendees} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          content="View"
          color="blue"
          floated="right"
        />
      </Segment>
    </SegmentGroup>
  );
};

export default observer(ActivityListItem);
