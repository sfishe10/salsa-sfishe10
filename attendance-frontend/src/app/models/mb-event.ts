import {EventAttendance} from './event-attendance';
import {Member} from './member';

export interface MBEvent {
  eventId: number;
  type: string;
  title: string;
  date: Date;
  pepBandId: string | null;
  termId: number;
  // these fields are only needed when fetching one MBEvent to populate the attendance form
  attendees?: Member[];
  attendances?: EventAttendance[];
}
