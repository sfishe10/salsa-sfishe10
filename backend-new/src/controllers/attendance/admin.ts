import {AttendanceService} from "../../services/attendance.service";
import {EventAttendanceDto} from "../../dto/event-attendance.dto";
import {EventAttendance} from "../../entities/event-attendance.entity";
import {toEventAttendanceDto} from "../../mappers/attendance.mapper";
import {plainToInstance} from "class-transformer";

const attendanceService = new AttendanceService();

export const create = async (req: any, res: any) => {
  try {
    const newAttendanceDto: EventAttendanceDto = plainToInstance(EventAttendanceDto, req.body);

    // send the saved attendance so the frontend can have the newly generated ID
    const savedAttendance: EventAttendance = await attendanceService.createBlankAttendance(newAttendanceDto);

    res.send(toEventAttendanceDto(savedAttendance));
  } catch (err: any) {
    console.error('A critical error occurred in attendance.create():', err.message);
    return res.status(500).send(err.message);
  }
};

export const update = async (req: any, res: any) => {
  try {
    const newAttendanceDto: EventAttendanceDto = plainToInstance(EventAttendanceDto, req.body);

    const savedAttendance: EventAttendance = await attendanceService.updateAttendance(newAttendanceDto);

    res.send(toEventAttendanceDto(savedAttendance));
  } catch (err: any) {
    console.error('A critical error occurred in attendance.update():', err.message);
    return res.status(500).send(err.message);
  }
};

export const submitForm = async (req: any, res: any) => {
  try {
    const attendanceDtos: EventAttendanceDto[] = plainToInstance(EventAttendanceDto, req.body as any[]);

    const savedAttendance: EventAttendance[] = await attendanceService.submitForm(attendanceDtos);

    res.send(savedAttendance.map(att => toEventAttendanceDto(att)));
  } catch (err: any) {
    console.error('A critical error occurred in attendance.submitForm():', err.message);
    return res.status(500).send(err.message);
  }
};

export const deleteAttendance = async (req: any, res: any) => {
  try {
    const attendanceId = req.params.id;

    await attendanceService.delete(attendanceId);

    res.status(200).send(null);
  } catch (err: any) {
    console.error('A critical error occurred in attendance.deleteAttendance():', err.message);
    return res.status(500).send(err.message);
  }

};
