export interface IUser {
  displayName: string;
  userName: string;
  image?: string;
  token: string;
}

//to cover both login and register
export interface IUserFormValues {
  displayName: string;
  email: string;
  password?: string;
  userName?: string;
}
