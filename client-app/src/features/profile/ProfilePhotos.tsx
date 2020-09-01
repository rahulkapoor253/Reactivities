import React, { useContext, useState } from "react";
import { Tab, Header, Card, Image, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);

  return (
    <Tab.Pane>
      <Header floated="left" content="Photos" icon="image" />
      {isCurrentUser && (
        <Button
          floated="right"
          content={addPhotoMode ? "Cancel" : "Add photo"}
          basic
          onClick={() => setAddPhotoMode(!addPhotoMode)}
        />
      )}
      {addPhotoMode ? (
        <p>My photo widget</p>
      ) : (
        <Card.Group itemsPerRow={5}>
          {profile &&
            profile.photos.map((photo) => (
              <Card key={photo.id}>
                <Image src={photo.url} />
                {isCurrentUser && (
                  <Button.Group fluid widths="2">
                    <Button basic positive content="Main" />
                    <Button basic negative icon="trash" />
                  </Button.Group>
                )}
              </Card>
            ))}
        </Card.Group>
      )}
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
