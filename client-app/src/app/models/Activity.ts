export interface IActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  city: string;
  venue: string;
  Attendees: IAttendee[];
}

export interface IActivityFormValues extends Partial<IActivity> {
  time?: Date;
}

export class ActivityFormValues implements IActivityFormValues {
  id?: string = undefined;
  title: string = "";
  description: string = "";
  category: string = "";
  date?: Date = undefined;
  time?: Date = undefined;
  city: string = "";
  venue: string = "";

  /**
   *fill values with activity data we get from API/store
   */
  constructor(init?: IActivityFormValues) {
    if (init && init.date) {
      init.time = init.date;
    }
    //populate object properties with init
    Object.assign(this, init);
  }
}

export interface IAttendee {
  displayName: string;
  image: string;
  isHost: boolean;
  username: string;
}
