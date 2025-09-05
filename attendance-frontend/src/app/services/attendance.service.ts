import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {EventAttendance} from '../models/event-attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  baseUrl = environment.apiURL + '/mb-attendance';

  constructor(private http: HttpClient) { }

  public getAttendanceById(attendanceId: number) {
    const url = this.baseUrl + `/attendance/${attendanceId}`;
    return this.http.get<EventAttendance>(url);
  }

  public updateAttendance(attendanceId: number, attendance: EventAttendance) {
    const url = this.baseUrl + `/attendance/${attendanceId}`;
    return this.http.put<Date>(url, {attendance});
  }
}
