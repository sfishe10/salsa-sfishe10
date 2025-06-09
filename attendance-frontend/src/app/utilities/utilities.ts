import {Constants} from './constants';

export class Utilities {
  public static getConflictColor(conflict: string): string {
    switch (conflict) {
      case 'Tuesday Conflict': return 'arriving-late';
      case 'Thursday Conflict': return 'leaving-early';
      case 'Arriving Late (both days)': return 'tuesday-conflict';
      case 'Leaving Early (both days)': return 'thursday-conflict';
      case 'Other': return 'other-conflict';
      default: return '';
    }
  }

  public static getRehearsalConflictOptions(): string[] {
    let rehearsalConflicts = [
      Constants.REHEARSAL_CONFLICT_TUES,
      Constants.REHEARSAL_CONFLICT_THURS,
      Constants.REHEARSAL_CONFLICT_ARRIVING_LATE,
      Constants.REHEARSAL_CONFLICT_LEAVING_EARLY,
      Constants.REHEARSAL_CONFLICT_OTHER
    ]
    return rehearsalConflicts;
  }

  public static getAttendanceOptions(includeSub: boolean): string[] {
    let attendanceOptions = [
      Constants.ATTENDANCE_PRESENT,
      Constants.ATTENDANCE_ABSENT_EXCUSED,
      Constants.ATTENDANCE_ABSENT_UNEXCUSED,
      Constants.ATTENDANCE_PARTIAL_EXCUSED,
      Constants.ATTENDANCE_PARTIAL_UNEXCUSED,
    ]
    if (includeSub) {
      attendanceOptions.push(Constants.ATTENDANCE_SUB);
    }
    return attendanceOptions;
  }

  public static getRoleOptions(): string[] {
    let roleOptions = [
      Constants.ROLE_ADMIN,
      Constants.ROLE_OFFICER,
      Constants.ROLE_ATTENDANCE_TAKER,
      Constants.ROLE_MEMBER
    ]
    return roleOptions;
  }

  public static getPepBandLabel(pepBandId: string): string {
    switch (pepBandId) {
      case Constants.PEP_BAND_ID_A: return Constants.PEP_BAND_LABEL_A;
      case Constants.PEP_BAND_ID_B: return Constants.PEP_BAND_LABEL_B;
      case Constants.PEP_BAND_ID_C: return Constants.PEP_BAND_LABEL_C;
      case Constants.PEP_BAND_ID_VOLUNTEER: return Constants.PEP_BAND_LABEL_VOLUNTEER;
      default: return '';
    }
  }
}
