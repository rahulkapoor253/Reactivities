import React, { useContext } from "react";
import { Segment, Item, Image, Header, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RootStoreContext } from "../../../app/stores/rootStore";

const activityImageStyle = {
  filter: "brightness(40%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "2%",
  left: "2%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface IProps {
  activity: IActivity;
}

const ActivityDetailedHeader: React.FC<IProps> = ({ activity }) => {
  const rootStore = useContext(RootStoreContext);
  const { cancelAttendance, attendActivity } = rootStore.activityStore;
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0px" }}>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{format(activity.date, "eeee do MMMM")}</p>
                <p>
                  Hosted by <strong>Bob</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <Button as={Link} to={`/manage/${activity.id}`} color="orange">
            Manage Event
          </Button>
        ) : activity.isGoing ? (
          <Button color="teal" onClick={cancelAttendance}>
            Cancel attendance
          </Button>
        ) : (
          <Button color="teal" onClick={attendActivity}>
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
