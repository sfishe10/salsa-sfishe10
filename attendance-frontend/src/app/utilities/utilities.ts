import {Constants} from './constants';
import {Section} from '../../../../shared/models/section';

export class Utilities {
  public static getConflictColor(conflict: string): string {
    switch (conflict) {
      case 'Tuesday Conflict': return 'tuesday-conflict';
      case 'Thursday Conflict': return 'thursday-conflict';
      case 'Arriving Late (both days)': return 'arriving-late';
      case 'Leaving Early (both days)': return 'leaving-early';
      case 'Other': return 'other-conflict';
      default: return 'no-conflict';
    }
  }

  public static getAttendanceColor(attendance: string): string {
    switch (attendance) {
      case Constants.ATTENDANCE_PRESENT: return 'present';
      case Constants.ATTENDANCE_LATE_EXCUSED: return 'partial-excused';
      case Constants.ATTENDANCE_LATE_UNEXCUSED: return 'partial-unexcused';
      case Constants.ATTENDANCE_LEFT_EARLY_EXCUSED: return 'partial-excused';
      case Constants.ATTENDANCE_LEFT_EARLY_UNEXCUSED: return 'partial-unexcused';
      case Constants.ATTENDANCE_ABSENT_EXCUSED: return 'absent-excused';
      case Constants.ATTENDANCE_ABSENT_UNEXCUSED: return 'absent-unexcused';
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
      Constants.ATTENDANCE_LATE_EXCUSED,
      Constants.ATTENDANCE_LATE_UNEXCUSED,
      Constants.ATTENDANCE_LEFT_EARLY_EXCUSED,
      Constants.ATTENDANCE_LEFT_EARLY_UNEXCUSED
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
      Constants.ROLE_SECTION_LEADER,
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

  public static isDrumline(section: Section): boolean {
    let sectionName: string = section.name;
    return sectionName === Constants.SECTION_CYMBALS
      || sectionName === Constants.SECTION_SNARE_DRUM
      || sectionName === Constants.SECTION_TENOR_DRUMS
      || sectionName === Constants.SECTION_BASS_DRUM;
  }
}
