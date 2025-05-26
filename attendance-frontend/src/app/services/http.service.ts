import { Injectable } from '@angular/core';
import {MsalService} from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private authService: MsalService) {
  }

  getAccessToken() {
    let accessToken: string | undefined = this.authService.instance.getActiveAccount()?.idToken;
    return accessToken;
  }
}
