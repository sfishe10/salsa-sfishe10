import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from '../models/member';
import {EventAttendanceMemberPage} from '../models/event-attendance-member-page';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = "http://localhost:3001/api/mb-attendance";

  constructor(private http: HttpClient) {}

  public getMemberById(id: number): Observable<Member> {
    const url = this.baseUrl + `/members/${id}`;
    return this.http.get<Member>(url);
  }

  public getMemberAttendances(memberId: number): Observable<EventAttendanceMemberPage[]> {
    const url = this.baseUrl + `/attendance/${memberId}`;
    return this.http.get<EventAttendanceMemberPage[]>(url);
  }
}
