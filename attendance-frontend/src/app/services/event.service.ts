import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MBEvent} from '../models/mb-event';
import {EventAttendance} from '../models/event-attendance';
import {Term} from '../models/term';
import {PepBand} from '../models/pep-band';

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

  public getTerms(): Observable<Term[]> {
    const url = this.baseUrl + '/mb-attendance/terms';
    return this.http.get<Term[]>(url);
  }

  public getPepBands(): Observable<PepBand[]> {
    const url = this.baseUrl + '/mb-attendance/pepBands';
    return this.http.get<PepBand[]>(url);
  }

  public createEvent(event: MBEvent) {
    const url = this.baseUrl + '/mb-attendance/events';
    return this.http.post<MBEvent>(url, {event: event})
  }

  public submitAttendanceForm(attendances: EventAttendance[]) {
    const url = this.baseUrl + `/mb-attendance/attendance/submitForm`;
    return this.http.post<EventAttendance>(url, {attendances: attendances});
  }

}
