import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  public getUserById(id: number): Observable<User> {
    const url = this.baseUrl + `/users/${id}`;
    return this.http.get<User>(url);
  }

  public updateUser(user: User) {
    const url = this.baseUrl + `/users`;
    return this.http.put<any>(url, user);
  }

}
