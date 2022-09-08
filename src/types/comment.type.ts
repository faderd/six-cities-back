import { User } from './user.type';

export type Comment = {
  text: string;
  postDate: Date;
  rating: number;
  user: User;
}
