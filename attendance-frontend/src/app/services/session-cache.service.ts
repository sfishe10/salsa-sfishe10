import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class SessionCacheService {
  baseUrl = "http://localhost:3001/api";

  constructor(private http: HttpClient) {}

  public preload() {

    this.http.get(this.baseUrl + `/mb-attendance/members/section/2`).subscribe(sectionMembers => {
      this.set(Constants.STORAGE_KEY_SECTION_MEMBERS, sectionMembers);
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
