import {PepBand} from './pep-band';
import {Term} from './term';

export interface MBEvent {
  eventId: number;
  type: string;
  title: string;
  date: Date;
  pepBand: PepBand | null;
  extraAttendeesAllowed?: boolean;
  term: Term;
}
