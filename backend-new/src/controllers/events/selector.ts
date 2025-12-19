import {MbEventService} from "../../services/mb-event.service";
import {MBEventDto} from "../../dto/mb-event.dto";
import {MBEvent} from "../../entities/mb-event.entity";
import {toMbEventDto} from "../../mappers/mb-event.mapper";
import {VolunteerRosterMemberCount} from "../../entities/volunteer-roster-member-count.entity";
import {VolunteerRosterMemberCountService} from "../../services/volunteer-roster-member-count.service";
import {EventAttendance} from "../../entities/event-attendance.entity";
import {AttendanceService} from "../../services/attendance.service";

const eventService = new MbEventService();
const vrmcService = new VolunteerRosterMemberCountService();
const attendanceService = new AttendanceService();

/**
 * Event selectors
 */

export const getRecent = async (req: any, res: any) => {
  try {
    const events: MBEventDto[] = await eventService.getRecent();

    res.send(events);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getUpcoming = async (req: any, res: any) => {
  try {
    const events: MBEventDto[] = await eventService.getUpcoming();

    res.send(events);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getById = async (req: any, res: any) => {
  const eventId = req.params.id;

  try {
    const mbEvent: MBEvent = await eventService.getById(eventId);

    const volunteerRosterMemberCounts: VolunteerRosterMemberCount[] = await vrmcService.getByEventId(mbEvent.eventId);

    mbEvent.volunteerRosterMemberCounts = volunteerRosterMemberCounts;

    if (!mbEvent) {
      return res.status(404).send('Event not found');
    }

    const eventDto = toMbEventDto(mbEvent);

    res.send(eventDto);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getByTermId = async (req: any, res: any) => {
  try {
    const termId = req.params.id;

    const events: MBEvent[] = await eventService.getByTermId(termId);

    const eventDtos = events.map(event => toMbEventDto(event));

    res.send(eventDtos);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};
