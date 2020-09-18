import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Grid, GridColumn } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface RouteParams {
  username: string;
}

const ProfilePage: React.FC<RouteComponentProps<RouteParams>> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    loadProfile,
    loadingProfile,
    follow,
    unfollow,
    loading,
    isCurrentUser,
  } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.username);
  }, [match.params.username, loadProfile]);

  if (loadingProfile) return <LoadingComponent content="loading profile" />;

  return (
    <div>
      <Grid>
        <GridColumn width="16">
          <ProfileHeader
            profile={profile!}
            follow={follow}
            unfollow={unfollow}
            loading={loading}
            isCurrentUser={isCurrentUser}
          />
          <ProfileContent />
        </GridColumn>
      </Grid>
    </div>
  );
};

export default observer(ProfilePage);
