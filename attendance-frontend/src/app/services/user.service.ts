import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "http://localhost:3001/api/mb-attendance";

  constructor(private http: HttpClient) {}

  public getUserById(id: number): Observable<User> {
    const url = this.baseUrl + `/users/${id}`;
    return this.http.get<User>(url);
  }

  public updateUser(user: User) {
    const url = this.baseUrl + `/users`;
    return this.http.put<any>(url, {user});
  }

}
