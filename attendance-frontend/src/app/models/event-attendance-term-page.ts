export interface EventAttendanceTermPage {
  attendanceId: number;
  attendanceStatus: string;
  eventId: number;
  eventTitle: string;
  eventDate: Date;
  memberId: number;
  memberFirstName: string;
  memberLastName: string;
  rehearsalConflict: string;
  subId: number;
  subFirstName: string;
  subLastName: string;
  sectionId: number;
  sectionName: string;
}
