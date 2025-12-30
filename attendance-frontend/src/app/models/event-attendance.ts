import {MBEvent} from './mb-event';
import {Member} from './member';
import {Section} from './section';

export interface EventAttendance {
  attendanceId: number;
  mbEvent: MBEvent;
  attendance: string | null;
  member: Member | null;
  sub: Member | null;
  required: boolean;
  lastUpdated: Date;
  section: Section;
}
