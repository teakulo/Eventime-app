import {User} from "./User";

export interface AppEvent {
  id: string;
  name: string;
  description: string;
  start_time: Date;
  end_time: Date;
  venue?: string;
  city?: string;
  category?: string;
  duration?: string;
  genre?: string;
  price?: number;
  creator: User;
  attendees: User[];
  creatorNickname?: string;
}
