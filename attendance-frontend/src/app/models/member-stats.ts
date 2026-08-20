export interface MemberStats {
  memberId: number;
  sectionId: number;
  sectionName: string;
  email: string;
  firstName: string;
  lastName: string;

  totalUnexcusedMisses: number;
  rehearsalsMissed: number;
  wholeBandEventsMissed: number;
  pepEventsMissed: number;

  wholeBandEventsAttended: number;
  rehearsalsAttended: number;

  totalPepEventsAttended: number;
  assignedAbcEventsAttended: number;
  extraAbcEventsAttended: number;
  abcEventsSubbed: number;
  volunteerEventsAttended: number;
}
