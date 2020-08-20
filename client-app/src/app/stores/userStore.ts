import { observable, action, computed, runInAction } from "mobx";
import "mobx-react-lite/batchingForReactDom";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";
import { history } from "../..";

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;

  //verify if user is logged in
  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });

      console.log(user);
      this.rootStore.commonStore.setToken(user.token);
      history.push("/activities");
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    //redirect to home
    history.push("/");
  };
}
