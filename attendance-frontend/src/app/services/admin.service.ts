import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Term} from '../models/term';
import {MBEvent} from '../models/mb-event';
import {Member} from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = "http://localhost:3001/api/mb-attendance";

  constructor(private http: HttpClient) {}

  public getTerms(): Observable<Term[]> {
    const url = this.baseUrl + '/terms';
    return this.http.get<Term[]>(url);
  }

  public getEventsByTermId(id: number): Observable<MBEvent[]> {
    const url = this.baseUrl + `/events/term/${id}`;
    return this.http.get<MBEvent[]>(url);
  }

  public getMembersByTermId(id: number): Observable<Member[]> {
    const url = this.baseUrl + `/members/term/${id}`;
    return this.http.get<Member[]>(url);
  }

  public createEvent(event: MBEvent) {
    const url = this.baseUrl + '/events';
    return this.http.post<MBEvent>(url, {event: event})
  }

  public createTerm(term: Term): Observable<Term> {
    const url = this.baseUrl + '/terms';
    return this.http.post<Term>(url, {term: term})
  }

  public createMember(memberInfo: any): Observable<Member> {
    const url = this.baseUrl + '/members';
    return this.http.post<Member>(url, {member: memberInfo});
  }

}
