import {Section} from './section';
import {MBEvent} from './mb-event';

export interface VolunteerRosterMemberCount {
  section: Section;
  event: MBEvent;
  numMembersNeeded: number | null;
}
