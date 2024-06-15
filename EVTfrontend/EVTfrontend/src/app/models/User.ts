import { AppEvent } from './AppEvent';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  bio: string;
  friends: User[];
  role: string;
  events_attending: AppEvent[];
}
