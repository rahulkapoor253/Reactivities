import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { IProfile, IPhoto } from "../models/Profile";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  //photo uploading indicator
  @observable uploadingPhoto = false;
  //setmain loading indicator
  @observable loading = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    }
    return false;
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const currentProfile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = currentProfile;
        this.loadingProfile = false;
      });
      console.log(currentProfile);
    } catch (err) {
      console.log(err);
      this.loadingProfile = false;
      throw err;
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          //look for main photo
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
          this.uploadingPhoto = false;
        }
      });
    } catch (err) {
      console.log(err);
      toast.error("problem uploading image");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        //make current main photo to be false and selected one to be true locally
        this.profile!.photos.find((x) => x.isMain)!.isMain = false;
        this.profile!.photos.find((x) => x.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      toast.error("problem setting main image");
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
