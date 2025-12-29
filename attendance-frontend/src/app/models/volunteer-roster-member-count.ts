import {Section} from './section';
import {MBEvent} from './mb-event';

export interface VolunteerRosterMemberCount {
  section: Section;
  eventId: number;
  numMembersNeeded: number | null;
}
