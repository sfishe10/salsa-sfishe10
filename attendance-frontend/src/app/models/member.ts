import {User} from './user';
import {PepBand} from './pep-band';
import {Section} from './section';
import {Term} from './term';
import {EventAttendanceMemberPage} from './event-attendance-member-page';

export interface Member {
  memberId: number;
  user: User;
  pepBand: PepBand | null;
  section: Section | null;
  rehearsalConflict: string | null;
  term: Term;
  attendances: EventAttendanceMemberPage[];
}
