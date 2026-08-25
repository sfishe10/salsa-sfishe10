export class Constants {
  static readonly REHEARSAL_CONFLICT_TUES = 'Tuesday Conflict';
  static readonly REHEARSAL_CONFLICT_THURS = 'Thursday Conflict';
  static readonly REHEARSAL_CONFLICT_LEAVING_EARLY = 'Leaving Early (both days)';
  static readonly REHEARSAL_CONFLICT_ARRIVING_LATE = 'Arriving Late (both days)';
  static readonly REHEARSAL_CONFLICT_OTHER = 'Other';

  static readonly EVENT_TYPE_WHOLE_BAND_EVENT = "Whole Band Event";
  static readonly EVENT_TYPE_PEP_EVENT = "Pep Event";
  static readonly EVENT_TYPE_REHEARSAL = "Rehearsal";

  static readonly PEP_BAND_ID_A = "A";
  static readonly PEP_BAND_ID_B = "B";
  static readonly PEP_BAND_ID_C = "C";
  static readonly PEP_BAND_ID_VOLUNTEER = "V";

  static readonly ROLE_ADMIN = 'Admin';
  static readonly ROLE_OFFICER = 'Officer';
  static readonly ROLE_SECTION_LEADER = 'Section Leader';
  static readonly ROLE_ATTENDANCE_TAKER = 'Attendance Taker';
  static readonly ROLE_MEMBER = 'Member';

  /**
   * CSV parsing column names
   *
   * NOTE: before uploading CSV files, check to make sure these values match the column names (converted to lowercase)!
   */


  static readonly REHEARSAL_CONFLICT_EMAIL_COL = 'email1';
  static readonly REHEARSAL_CONFLICT_TUESDAY_COL = 'tuesday rehearsal';
  static readonly REHEARSAL_CONFLICT_THURSDAY_COL = 'thursday rehearsal';

  static readonly SUPP_FORM_SECTION_COL = 'section';
  static readonly SUPP_FORM_FNAME_COL = 'first name';
  static readonly SUPP_FORM_LNAME_COL = 'last name';
  static readonly SUPP_FORM_CP_EMAIL_COL = 'cp email';
  static readonly SUPP_FORM_PREF_EMAIL_COL = 'preferred email address';
}
