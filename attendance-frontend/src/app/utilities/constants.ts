export class Constants {
  static readonly EVENT_TYPE_EVENT = "Event";
  static readonly EVENT_TYPE_REHEARSAL = "Rehearsal";

  static readonly PEP_BAND_A = "A Band";
  static readonly PEP_BAND_B = "B Band";
  static readonly PEP_BAND_C = "C Band";

  static readonly PEP_BAND_A_ID = "A";
  static readonly PEP_BAND_B_ID = "B";
  static readonly PEP_BAND_C_ID = "C";

  static readonly REHEARSAL_CONFLICT_TUES = 'Tuesday Conflict';
  static readonly REHEARSAL_CONFLICT_THURS = 'Thursday Conflict';
  static readonly REHEARSAL_CONFLICT_LEAVING_EARLY = 'Leaving Early (both days)'
  static readonly REHEARSAL_CONFLICT_ARRIVING_LATE = 'Arriving Late (both days)';
  static readonly REHEARSAL_CONFLICT_OTHER = 'Other'

  static readonly ATTENDANCE_PRESENT = 'Present';
  static readonly ATTENDANCE_ABSENT_UNEXCUSED = 'Absent Unexcused'
  static readonly ATTENDANCE_ABSENT_EXCUSED = 'Absent Excused'
  static readonly ATTENDANCE_PARTIAL_UNEXCUSED = 'Partial Unexcused'
  static readonly ATTENDANCE_PARTIAL_EXCUSED = 'Partial Excused'
  static readonly ATTENDANCE_SUB = 'Sub'

  // SESSION CACHE STORAGE KEYS
  static readonly STORAGE_KEY_SECTION_MEMBERS = 'SECTION_MEMBERS'
}
