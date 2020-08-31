import React, { useContext } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Grid, GridColumn } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";

const ProfilePage = () => {
  const rootStore = useContext(RootStoreContext);
  return (
    <div>
      <Grid>
        <GridColumn width="16">
          <ProfileHeader />
          <ProfileContent />
        </GridColumn>
      </Grid>
    </div>
  );
};

export default ProfilePage;
