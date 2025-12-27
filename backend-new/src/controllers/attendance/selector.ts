import {AttendanceService} from "../../services/attendance.service";
import {EventAttendanceDto} from "../../dto/event-attendance.dto";
import {MemberStatsDto} from "../../dto/member-stats.dto";
import {AttendanceTermPageDto} from "../../dto/attendance-term-page.dto";
import {EventAttendance} from "../../entities/event-attendance.entity";
import {NotFoundError} from "../../errors/not-found-error";
import {toEventAttendanceDto} from "../../mappers/attendance.mapper";

const attendanceService = new AttendanceService();

/**
 * Attendance selectors
 */

export const getById = async (req: any, res: any) => {
  try {
    const attendanceId = req.params.id;

    const attendance: EventAttendance | null = await attendanceService.getById(attendanceId);

    res.send(toEventAttendanceDto(attendance));

  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).send('Attendance not found');
    }

    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getBySectionAndEventId = async (req: any, res: any) => {
  try {
    const eventId = req.params.eventId
    const sectionId = req.params.sectionId

    const attendances: EventAttendanceDto[] = await attendanceService.getBySectionAndEventId(sectionId, eventId);

    res.send(attendances);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getByTermIdAndSection = async (req: any, res: any) => {
  try {
    const termId = req.params.termId;
    const sectionId = req.params.sectionId !== 'null' ? req.params.sectionId : null;
    const eventType = req.params.eventType;

    const attendances: AttendanceTermPageDto[] =
        await attendanceService.getByTermIdAndSection(termId, sectionId, eventType);

    res.send(attendances);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getByTermIdAndSectionAndPepBand = async (req: any, res: any) => {
  try {
    const termId = req.params.termId;
    const pepBandId = req.params.pepBandId;
    const sectionId = req.params.sectionId !== 'null' ? req.params.sectionId : null;
    const ignoreMemberPepBand = req.query.ignoreMemberPepBand === 'true';

    const attendances: AttendanceTermPageDto[] =
        await attendanceService.getByTermIdAndSectionAndPepBand(termId, pepBandId, sectionId, ignoreMemberPepBand);

    res.send(attendances);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getMemberStatsBySectionId = async (req: any, res: any) => {
  try {
    const sectionId = req.params.id;

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
