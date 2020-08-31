export interface IProfile {
  displayName: string;
  image: string;
  bio: string;
  username: string;
  photos: IPhoto[];
}

export interface IPhoto {
  id: string;
  url: string;
  isMain: boolean;
}
