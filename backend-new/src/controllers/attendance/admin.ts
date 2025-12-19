import {AttendanceService} from "../../services/attendance.service";
import {EventAttendanceDto} from "../../dto/event-attendance.dto";
import {EventAttendance} from "../../entities/event-attendance.entity";
import {toEventAttendanceDto} from "../../mappers/attendance.mapper";
import {plainToInstance} from "class-transformer";

const attendanceService = new AttendanceService();

export const create = async (req: any, res: any) => {
  const newAttendanceDto: EventAttendanceDto = plainToInstance(EventAttendanceDto, req.body);

  // send the saved attendance so the frontend can have the newly generated ID
  const savedAttendance: EventAttendance = await attendanceService.createAttendance(newAttendanceDto);

  res.send(toEventAttendanceDto(savedAttendance));
};

export const update = async (req: any, res: any) => {
  const newAttendanceDto: EventAttendanceDto = plainToInstance(EventAttendanceDto, req.body);

  const savedAttendance: EventAttendance = await attendanceService.updateAttendance(newAttendanceDto);

  res.send(toEventAttendanceDto(savedAttendance));
};

export const submitForm = async (req: any, res: any) => {
  const attendanceDtos: EventAttendanceDto[] = plainToInstance(EventAttendanceDto, req.body as any[]);

  const savedAttendance: EventAttendance[] = await attendanceService.submitForm(attendanceDtos);

  res.send(savedAttendance.map(att => toEventAttendanceDto(att)));
};

export const deleteAttendance = async (req: any, res: any) => {
  const attendanceId = req.params.id;

  await attendanceService.delete(attendanceId);

  res.status(200).send(null);
};
