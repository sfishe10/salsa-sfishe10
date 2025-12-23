import {MbEventService} from "../../services/mb-event.service";
import {MBEventDto} from "../../dto/mb-event.dto";
import {MBEvent} from "../../entities/mb-event.entity";
import {toMbEventDto} from "../../mappers/mb-event.mapper";
import {VolunteerRosterMemberCount} from "../../entities/volunteer-roster-member-count.entity";
import {VolunteerRosterMemberCountService} from "../../services/volunteer-roster-member-count.service";
import {NotFoundError} from "../../errors/not-found-error";

const eventService = new MbEventService();
const vrmcService = new VolunteerRosterMemberCountService();

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

    mbEvent.volunteerRosterMemberCounts = await vrmcService.getByEventId(mbEvent.eventId);

    const eventDto = toMbEventDto(mbEvent);

    res.send(eventDto);

  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).send('Event not found');
    }

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
