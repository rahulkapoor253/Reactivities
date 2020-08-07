import React from "react";
import { Segment, Grid, Icon } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";

interface IProps {
  activity: IActivity;
}

const ActivityDetailedInfo: React.FC<IProps> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid>
          <Grid.Column width={1}>
            <Icon color="teal" name="info" />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{activity.description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign="middle">
          <Grid.Column width={1}>
            <Icon name="calendar" color="teal" />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{activity.date}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign="middle">
          <Grid.Column width={1}>
            <Icon name="marker" color="teal" />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>
              {activity.venue}, {activity.city}
            </span>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment.Group>
  );
};

export default ActivityDetailedInfo;
