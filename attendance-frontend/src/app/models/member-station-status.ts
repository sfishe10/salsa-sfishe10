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

  // used in the admin overview
  memberId: number,
  memberFirst: string,
  memberLast: string,
  sectionId: number,
  sectionName: string
}
