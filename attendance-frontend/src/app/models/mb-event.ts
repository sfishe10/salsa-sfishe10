export interface MBEvent {
  eventId: number;
  type: string;
  title: string;
  date: Date;
  pepBand: string | null;
  termId: number;
}
