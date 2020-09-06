import React, { useContext, useState } from "react";
import { Tab, Header, Card, Image, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import PhotoUploadWidget from "../../app/common/photoUpload/PhotoUploadWidget";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    loading,
    setMainPhoto,
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);

  //reset content after photo upload
  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

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
        <PhotoUploadWidget
          uploadPhoto={handleUploadImage}
          loading={uploadingPhoto}
        />
      ) : (
        <Card.Group itemsPerRow={5}>
          {profile &&
            profile.photos.map((photo) => (
              <Card key={photo.id}>
                <Image src={photo.url} />
                {isCurrentUser && (
                  <Button.Group fluid widths="2">
                    <Button
                      onClick={(e) => {
                        setMainPhoto(photo);
                        setTarget(e.currentTarget.name);
                      }}
                      loading={loading && target === photo.id}
                      disabled={photo.isMain}
                      basic
                      positive
                      content="Main"
                      name={photo.id}
                    />
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
