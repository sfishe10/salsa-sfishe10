import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ApiService} from './services/api.service';
import {NgIf} from '@angular/common';
import {MsalBroadcastService, MsalService} from '@azure/msal-angular';
import {filter, Subject, takeUntil} from 'rxjs';
import {AuthenticationResult, EventMessage, EventType} from '@azure/msal-browser';
import msalInstance from './app.config';
import {MatSidenavContainer, MatSidenavContent, MatSidenavModule} from '@angular/material/sidenav';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {Router} from '@angular/router';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink,
    MatSidenavModule, MatIconButton, MatIcon, MatToolbar, MatDivider],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  message: any;

  constructor(
      private authService: MsalService,
      private apiService: ApiService,
      private msalBroadcastService: MsalBroadcastService,
      public router: Router) { };

  ngOnInit() {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        const authResult = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(authResult.account);
        console.log('Login successful:', authResult.account);

        this.apiService.getMessage().subscribe(data => {
          this.message = data;
        });
      });

    // Check if user is already logged in
    const activeAccount = async() => {
      await msalInstance.initialize();
      this.authService.instance.getActiveAccount();
    }
    if (!activeAccount) {
      console.log('User not logged in. Redirecting to login...');
      this.authService.loginRedirect();
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }


}
