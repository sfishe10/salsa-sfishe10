import {Member} from './member';
import {User} from './user';

export interface Me {
  member?: Member;
  user: User;
}
