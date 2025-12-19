import {MbEventService} from "../../services/mb-event.service";
import {MBEventDto} from "../../dto/mb-event.dto";
import {MBEvent} from "../../entities/mb-event.entity";
import {toMbEventDto} from "../../mappers/mb-event.mapper";
import {plainToInstance} from "class-transformer";

const eventService = new MbEventService();


export const create = async (req: any, res: any) => {
  const newEventDto: MBEventDto = plainToInstance(MBEventDto, req.body);

  const savedEvent: MBEvent = await eventService.create(newEventDto);

  res.send(toMbEventDto(savedEvent));
};

export const update = async (req: any, res: any) => {
  const eventDto: MBEventDto = plainToInstance(MBEventDto, req.body);

  const updatedEvent: MBEvent = await eventService.update(eventDto);

  res.send(toMbEventDto(updatedEvent));
};

export const deleteEvent = async (req: any, res: any) => {
  const eventId = req.params.id;

  await eventService.delete(eventId);

  res.status(200).send(null);
};
