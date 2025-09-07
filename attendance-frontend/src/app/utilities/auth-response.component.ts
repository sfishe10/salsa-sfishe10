import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-auth-response',
  template: '<p>Redirecting...</p>'
})
export class AuthResponseComponent implements OnInit {
  constructor(private msalService: MsalService, private router: Router) {}

  ngOnInit(): void {
    const msalInstance = this.msalService.instance;

    if (!msalInstance || !msalInstance.getAllAccounts) {
      console.error('MSAL instance not ready yet');
      return;
    }

    msalInstance.initialize().then(() => {
      return msalInstance.handleRedirectPromise();
    }).then((result: AuthenticationResult | null) => {
      if (result) {
        msalInstance.setActiveAccount(result.account);
      }
      this.router.navigate(['/events'], { queryParams: { type: 'upcoming' } });
    }).catch((error: any) => {
      console.error('Redirect error:', error);
      this.router.navigate(['/unauthorized']);
    });
  }
}
