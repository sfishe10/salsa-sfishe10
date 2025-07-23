import {MBEvent} from './mb-event';
import {Member} from './member';

export interface EventAttendance {
  attendanceId: number;
  event: MBEvent;
  attendance: string;
  member: Member;
  sub: Member | null;
}
