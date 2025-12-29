import {MbEventService} from "../../services/mb-event.service";
import {MBEventDto} from "../../dto/mb-event.dto";
import {MBEvent} from "../../entities/mb-event.entity";
import {toMbEventDto} from "../../mappers/mb-event.mapper";
import {plainToInstance} from "class-transformer";

const eventService = new MbEventService();


export const create = async (req: any, res: any) => {
  try {
    const newEventDto: MBEventDto = plainToInstance(MBEventDto, req.body);

    const savedEvent: MBEvent = await eventService.create(newEventDto);

    res.send(toMbEventDto(savedEvent));
  } catch (err: any) {
    console.error('A critical error occurred in events.create():', err.message);
    return res.status(500).send(err.message);
  }
};

export const update = async (req: any, res: any) => {
  try {
    const eventDto: MBEventDto = plainToInstance(MBEventDto, req.body);

    const updatedEvent: MBEvent = await eventService.update(eventDto);

    res.send(toMbEventDto(updatedEvent));
  } catch (err: any) {
    console.error('A critical error occurred in events.update():', err.message);
    return res.status(500).send(err.message);
  }
};

export const deleteEvent = async (req: any, res: any) => {
  try {
    const eventId = req.params.id;

    await eventService.delete(eventId);

    res.status(200).send(null);
  } catch (err: any) {
    console.error('A critical error occurred in events.deleteEvent():', err.message);
    return res.status(500).send(err.message);
  }
};
