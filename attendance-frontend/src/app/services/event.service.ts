import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MBEvent} from '../models/mb-event';
import {EventAttendance} from '../models/event-attendance';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseUrl = "http://localhost:3001/api/mb-attendance";

  constructor(private http: HttpClient) {}

  public getUpcomingEvents(): Observable<MBEvent[]> {
    const url = this.baseUrl + '/events/upcoming';
    return this.http.get<MBEvent[]>(url);
  }

  public getRecentEvents(): Observable<MBEvent[]> {
    const url = this.baseUrl + '/events/recent';
    return this.http.get<MBEvent[]>(url);
  }

  public getEvent(id: number): Observable<MBEvent> {
    const url = this.baseUrl + `/events/${id}`
    return this.http.get<MBEvent>(url);
  }

  public submitAttendanceForm(attendances: EventAttendance[]) {
    const url = this.baseUrl + `/attendance/submitForm`;
    return this.http.post<EventAttendance>(url, {attendances: attendances});
  }

}
