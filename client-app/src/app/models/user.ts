export interface IUser {
  displayName: string;
  username: string;
  image?: string;
  token: string;
}

//to cover both login and register
export interface IUserFormValues {
  displayName: string;
  email: string;
  password?: string;
  username?: string;
}
