import { Injectable } from '@angular/core';
import {MsalService} from '@azure/msal-angular';
import {SilentRequest} from '@azure/msal-browser';
import {protectedResources} from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private authService: MsalService) {
  }

  getAccessToken(): Promise<string> {
    const account = this.authService.instance.getActiveAccount();
    if (!account) return Promise.reject('No active account');

    const request: SilentRequest = {
      account: account,
      scopes: protectedResources.demoApi.scopes
    };

    return this.authService.instance.acquireTokenSilent(request)
      .then(result => result.accessToken);
  }
}
