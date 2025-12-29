import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {EventAttendance} from '../models/event-attendance';
import {Observable} from 'rxjs';
import {MemberStats} from '../models/member-stats';

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
    return this.http.put<EventAttendance>(url, attendance);
  }

  public getMemberStatsBySectionId(sectionId: number): Observable<MemberStats[]> {
    const url = this.baseUrl + `/attendance/section/${sectionId}/stats`;
    return this.http.get<MemberStats[]>(url);
  }
}
