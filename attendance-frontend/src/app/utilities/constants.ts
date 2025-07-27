export class Constants {
  static readonly PEP_BAND_ID_A = "A";
  static readonly PEP_BAND_ID_B = "B";
  static readonly PEP_BAND_ID_C = "C";
  static readonly PEP_BAND_ID_VOLUNTEER = "V";

  static readonly PEP_BAND_LABEL_A = "A Band";
  static readonly PEP_BAND_LABEL_B = "B Band";
  static readonly PEP_BAND_LABEL_C = "C Band";
  static readonly PEP_BAND_LABEL_VOLUNTEER = "Volunteer";


  static readonly EVENT_TYPE_WHOLE_BAND_EVENT = "Whole Band Event";
  static readonly EVENT_TYPE_PEP_EVENT = "Pep Event";
  static readonly EVENT_TYPE_REHEARSAL = "Rehearsal";

  static readonly REHEARSAL_CONFLICT_TUES = 'Tuesday Conflict';
  static readonly REHEARSAL_CONFLICT_THURS = 'Thursday Conflict';
  static readonly REHEARSAL_CONFLICT_LEAVING_EARLY = 'Leaving Early (both days)';
  static readonly REHEARSAL_CONFLICT_ARRIVING_LATE = 'Arriving Late (both days)';
  static readonly REHEARSAL_CONFLICT_OTHER = 'Other';

  static readonly ATTENDANCE_PRESENT = 'Present';
  static readonly ATTENDANCE_ABSENT_UNEXCUSED = 'Absent Unexcused';
  static readonly ATTENDANCE_ABSENT_EXCUSED = 'Absent Excused';
  static readonly ATTENDANCE_PARTIAL_UNEXCUSED = 'Partial Unexcused';
  static readonly ATTENDANCE_PARTIAL_EXCUSED = 'Partial Excused';
  static readonly ATTENDANCE_SUB = 'Sub';

  static readonly ROLE_ADMIN = 'Admin';
  static readonly ROLE_OFFICER = 'Officer';
  static readonly ROLE_ATTENDANCE_TAKER = 'Attendance Taker';
  static readonly ROLE_MEMBER = 'Member';

  // SESSION CACHE STORAGE KEYS
  static readonly STORAGE_KEY_ME = 'ME';
  static readonly STORAGE_KEY_IS_ADMIN = 'IS_ADMIN';
  static readonly STORAGE_KEY_IS_OFFICER = 'IS_OFFICER';
  static readonly STORAGE_KEY_SECTION_MEMBERS = 'SECTION_MEMBERS';
  static readonly STORAGE_KEY_SECTION_ID = 'SECTION_ID';
  static readonly STORAGE_KEY_SECTIONS = 'SECTIONS'
  static readonly STORAGE_KEY_PEP_BANDS = 'PEP_BANDS';
  static readonly STORAGE_KEY_USER = 'USER';
}
