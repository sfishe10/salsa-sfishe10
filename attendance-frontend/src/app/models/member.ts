import {User} from './user';
import {PepBand} from './pep-band';
import {Section} from './section';
import {Term} from './term';

export interface Member {
  memberId: number;
  user: User;
  pepBand: PepBand | null;
  section: Section | null;
  rehearsalConflict: string | null;
  term: Term
}
