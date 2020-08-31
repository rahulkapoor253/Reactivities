import React, { useContext } from "react";
import { Tab, Header, Card, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile } = rootStore.profileStore;

  return (
    <Tab.Pane>
      <Header content="Photos" icon="image" />
      <Card.Group itemsPerRow={5}>
        {profile &&
          profile.photos.map((photo) => (
            <Card key={photo.id}>
              <Image src={photo.url} />
            </Card>
          ))}
      </Card.Group>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
