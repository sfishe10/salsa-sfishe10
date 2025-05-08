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
}
