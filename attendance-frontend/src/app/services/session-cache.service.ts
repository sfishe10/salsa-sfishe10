import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Constants} from '../utilities/constants';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SessionCacheService {
  baseUrl = "http://localhost:3001/api";

  headers: HttpHeaders | undefined;

  constructor(private http: HttpClient, private httpService: HttpService) {}

  public preload() {

    this.httpService.getAccessToken().then(token => {
      this.headers = new HttpHeaders({
        Authorization: 'Bearer ' + token
      });
    });
    console.log(this.headers);

    this.http.get(this.baseUrl + `/mb-attendance/members/section/2`).subscribe(sectionMembers => {
      this.set(Constants.STORAGE_KEY_SECTION_MEMBERS, sectionMembers);
    })

    this.http.get(this.baseUrl + '/me').subscribe(member => {
      this.set(Constants.STORAGE_KEY_ROLE, member);
    })

  }

  get(key: string): any {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  set(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
