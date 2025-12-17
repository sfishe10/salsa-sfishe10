import {db} from "../../config/data-source";
import {AttendanceService} from "../../services/attendance.service";
import {EventAttendanceDto} from "../../dto/event-attendance.dto";
import {MemberStatsDto} from "../../dto/member-stats.dto";
import {AttendanceTermPageDto} from "../../dto/attendance-term-page.dto";

const attendanceService = new AttendanceService();

/**
 * Attendance selectors
 */

export const getById = async (req: any, res: any) => {
  const attendanceId = req.params.id;

  try {
    const attendance: EventAttendanceDto | null = await attendanceService.getById(attendanceId);

    if (!attendance) {
      return res.status(404).send('Attendance not found');
    }

    res.send(attendance);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};


// module.exports.getByMemberId = async (req, res) => {
//   const memberId = req.params.id;
//   db.execute('SELECT attendanceId, attendance, ' +
//     'e.*, mem.memberId, u.firstName as memFirst, u.lastName as memLast, ' +
//     'sub.memberId as subId, sub_u.firstName as subFirst, sub_u.lastName as subLast ' +
//     'FROM ' +
//     'EventAttendance ea ' +
//     'JOIN MBEvent e ON ea.eventId = e.eventId ' +
//     'JOIN Member mem ON ea.memberId = mem.memberId ' +
//     'JOIN User u ON mem.email = u.email ' +
//     'LEFT JOIN Member sub ON ea.subId = sub.memberId ' +
//     'LEFT JOIN User sub_u ON sub.email = sub_u.email ' +
//     'WHERE ea.memberId=? OR ea.subId=? ' +
//     'ORDER BY e.date', [memberId, memberId], (err, results) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err.message);
//     } else {
//       const attendances = [];
//       results.forEach((row) => {
//         const attendance = {
//           attendanceId: row.attendanceId,
//           attendanceStatus: row.attendance,
//           eventId: row.eventId,
//           eventTitle: row.title,
//           eventType: row.type,
//           eventDate: convertDateToPST(row.date),
//           memberId: row.memberId,
//           memberFirstName: row.memFirst,
//           memberLastName: row.memLast,
//           subId: row.subId,
//           subFirstName: row.subFirst,
//           subLastName: row.subLast,
//         };
//         attendances.push(attendance);
//       });
//       res.send(attendances);
//     }
//   });
// };

export const getBySectionAndEventId = async (req: any, res: any) => {
  const eventId = req.params.eventId
  const sectionId = req.params.sectionId

  try {
    const attendances: EventAttendanceDto[] = await attendanceService.getBySectionAndEventId(sectionId, eventId);

    res.send(attendances);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getByTermIdAndSection = async (req: any, res: any) => {
  const termId = req.params.termId;
  const sectionId = req.params.sectionId !== 'null' ? req.params.sectionId : null;
  const eventType = req.params.eventType;

  try {
    const attendances: AttendanceTermPageDto[] =
        await attendanceService.getByTermIdAndSection(termId, sectionId, eventType);

    res.send(attendances);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getByTermIdAndSectionAndPepBand = async (req: any, res: any) => {
  const termId = req.params.termId;
  const pepBandId = req.params.pepBandId;
  const sectionId = req.params.sectionId !== 'null' ? req.params.sectionId : null;
  const ignoreMemberPepBand = req.query.ignoreMemberPepBand === 'true';

  try {
    const attendances: AttendanceTermPageDto[] =
        await attendanceService.getByTermIdAndSectionAndPepBand(termId, pepBandId, sectionId, ignoreMemberPepBand);

    res.send(attendances);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getMemberStatsBySectionId = async (req: any, res: any) => {
  const sectionId = req.params.id;
  try {
    const stats: MemberStatsDto = await attendanceService.getMemberStatsBySectionId(sectionId);

    if (!stats) {
      return res.status(404).send('Stats not found');
    }

    res.send(stats);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};
