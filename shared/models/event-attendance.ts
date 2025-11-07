import {MBEvent} from './mb-event';
import {Member} from './member';

export interface EventAttendance {
  attendanceId: number;
  event: MBEvent;
  attendance: string;
  member: Member | null;
  sub: Member | null;
  required: boolean;
  lastUpdated: Date;
  sectionId: number;
}
