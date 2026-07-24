import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from '../models/member';
import {EventAttendanceMemberPage} from '../models/event-attendance-member-page';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiURL + '/mb-attendance';

  constructor(private http: HttpClient) {}

  public getMemberById(id: number): Observable<Member> {
    const url = this.baseUrl + `/members/${id}`;
    return this.http.get<Member>(url);
  }

  public getMembersByTermId(id: number): Observable<Member[]> {
    const url = this.baseUrl + `/members/term/${id}`;
    return this.http.get<Member[]>(url);
  }

  public updateMember(member: Member): Observable<Member> {
    const url = this.baseUrl + `/members/${member.memberId}`;
    return this.http.put<Member>(url, member);
  }

  public deleteMember(member: Member): Observable<any> {
    const url = this.baseUrl + `/members/${member.memberId}`;
    return this.http.delete<any>(url);
  }

  public getMemberAttendances(memberId: number): Observable<EventAttendanceMemberPage[]> {
    const url = this.baseUrl + `/attendance/member/${memberId}`;
    return this.http.get<EventAttendanceMemberPage[]>(url);
  }

  public getMembersBySectionAndTermId(sectionId: number, termId: number): Observable<Member[]> {
    const url = this.baseUrl + `/members/section/${sectionId}/term/${termId}`;
    return this.http.get<Member[]>(url);
  }
}
