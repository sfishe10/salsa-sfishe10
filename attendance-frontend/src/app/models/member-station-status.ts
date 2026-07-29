export interface MemberStationStatus {
  stationId: number,
  stationTitle: string,
  stationLevel: number,
  stationClass: number,
  evalId: number,
  status: string,
  attemptCount: number,
  evalTime: Date | null,
  evaluatorFirst: string | null,
  evaluatorLast: string | null;
}
