import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MBEvent} from '../models/mb-event';
import {EventAttendance} from '../models/event-attendance';
import {environment} from '../../environments/environment';
import {VolunteerRosterMemberCount} from '../models/volunteer-roster-member-count';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseUrl = environment.apiURL + '/mb-attendance';

  constructor(private http: HttpClient) {}

  public getUpcomingEvents(): Observable<MBEvent[]> {
    const url = this.baseUrl + '/events/upcoming';
    return this.http.get<MBEvent[]>(url);
  }

  public getRecentEvents(): Observable<MBEvent[]> {
    const url = this.baseUrl + '/events/recent';
    return this.http.get<MBEvent[]>(url);
  }

  public getVolunteerEvents(): Observable<MBEvent[]> {
    const url = this.baseUrl + '/events/volunteer';
    return this.http.get<MBEvent[]>(url);
  }

  public getEvent(id: number): Observable<MBEvent> {
    const url = this.baseUrl + `/events/${id}`
    return this.http.get<MBEvent>(url);
  }

  public submitAttendanceForm(attendances: EventAttendance[]) {
    const url = this.baseUrl + `/attendance/submitForm`;
    return this.http.post<EventAttendance>(url, attendances);
  }

  public getEventAttendance(eventId: number, sectionId: number): Observable<EventAttendance[]> {
    const url = this.baseUrl + `/attendance/event/${eventId}/section/${sectionId}`;
    return this.http.get<EventAttendance[]>(url);
  }

  public addAttendance(eventId: number, sectionId: number | null): Observable<any> {
    const url = this.baseUrl + `/attendance`;
    return this.http.post<any>(url, {eventId, sectionId})
  }

  public removeAttendance(attendanceId: number): Observable<any> {
    const url = this.baseUrl + `/attendance/${attendanceId}`;
    return this.http.delete<any>(url)
  }

}
