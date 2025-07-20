import {EventAttendance} from './event-attendance';
import {Member} from './member';
import {PepBand} from './pep-band';
import {Term} from './term';

export interface MBEvent {
  eventId: number;
  type: string;
  title: string;
  date: Date;
  pepBand: PepBand | null;
  term: Term;
  // these fields are only needed when fetching one MBEvent to populate the attendance form
  attendees?: Member[];
  attendances?: EventAttendance[];
}
