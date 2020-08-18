import { observable, action, computed, configure } from "mobx";
import "mobx-react-lite/batchingForReactDom";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

configure({ enforceActions: "always" });

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
      this.user = user;
    } catch (err) {
      console.log(err);
    }
  };
}
