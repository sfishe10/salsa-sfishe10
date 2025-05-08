import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from '../models/member';
import {MBEvent} from '../models/mb-event';
import {EventAttendance} from '../models/event-attendance';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseUrl = "http://localhost:3001/api";

  constructor(private http: HttpClient) {}

  public getAllEvents(): Observable<MBEvent[]> {
    const url = this.baseUrl + '/mb-attendance/events';
    return this.http.get<MBEvent[]>(url);
  }

  public getUpcomingEvents(): Observable<MBEvent[]> {
    const url = this.baseUrl + '/mb-attendance/events/upcoming';
    return this.http.get<MBEvent[]>(url);
  }

  public getRecentEvents(): Observable<MBEvent[]> {
    const url = this.baseUrl + '/mb-attendance/events/recent';
    return this.http.get<MBEvent[]>(url);
  }

  public getEvent(id: number): Observable<MBEvent> {
    const url = this.baseUrl + `/mb-attendance/events/${id}`
    return this.http.get<MBEvent>(url);
  }

  public getEventAttendees(id: number): Observable<Member[]> {
    const url = this.baseUrl + `/mb-attendance/events/${id}/members`
    return this.http.get<Member[]>(url);
  }

  public getSectionMembers(id: number): Observable<Member[]> {
    const url = this.baseUrl + `/mb-attendance/members/section/${id}`
    return this.http.get<Member[]>(url);
  }

  public submitAttendanceForm(attendances: EventAttendance[]) {
    const url = this.baseUrl + `/mb-attendance/attendance`;
    return this.http.post<EventAttendance>(url, {attendances: attendances});
  }

}
