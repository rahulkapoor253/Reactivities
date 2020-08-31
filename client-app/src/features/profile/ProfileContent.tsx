import React from "react";
import { Tab } from "semantic-ui-react";

const panes = [
  { menuItem: "About", render: () => <Tab.Pane>About</Tab.Pane> },
  { menuItem: "Photos", render: () => <Tab.Pane>Photos</Tab.Pane> },
  { menuItem: "Events", render: () => <Tab.Pane>Events</Tab.Pane> },
  { menuItem: "Followers", render: () => <Tab.Pane>Followers</Tab.Pane> },
  { menuItem: "Following", render: () => <Tab.Pane>Following</Tab.Pane> },
];

const ProfileContent = () => {
  return (
    <Tab
      panes={panes}
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
    />
  );
};

export default ProfileContent;
