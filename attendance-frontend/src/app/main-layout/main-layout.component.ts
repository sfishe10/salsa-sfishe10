import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet} from "@angular/router";
import {filter, Subject, takeUntil} from 'rxjs';
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from '@azure/msal-angular';
import {SessionCacheService} from '../services/session-cache.service';
import {AuthenticationResult, EventMessage, EventType, InteractionStatus, RedirectRequest} from '@azure/msal-browser';
import {environment} from '../../environments/environment';
import {Constants} from '../utilities/constants';

@Component({
  selector: 'app-main-layout',
  standalone: true,
    imports: [
        MatDivider,
        MatIcon,
        MatIconButton,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        MatToolbar,
        NgIf,
        RouterLink,
        RouterOutlet
    ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{

  @ViewChild('sidenav') sidenav: any;

  reactUrl = environment.reactAppUrl;

  eventType: string = 'upcoming'; // default

  constructor(
    public sessionCacheService: SessionCacheService,
    public router: Router,
    public route: ActivatedRoute) { };

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.route.queryParams.subscribe(params => {
          this.eventType = params['type'] || 'upcoming';
        });
      });
  }

  get pageTitle(): string {
    if (this.router.url.startsWith('/events')) {
      return this.eventType === 'upcoming' ? 'Upcoming Events' : 'Recent Events';
    }
    if (this.router.url === '/profile') return 'Profile';
    if (this.router.url.includes('/attendance-form')) return 'Enter Attendance';
    if (this.router.url.includes('/member')) return 'Member';
    if (this.router.url.includes('/user')) return 'User';
    if (this.router.url === '/event' || this.router.url.startsWith('/event/')) return 'Event';
    if (this.router.url.includes('/attendance/term')) return 'Attendance';
    if (this.router.url === '/admin') return 'Admin';
    if (this.router.url.includes('/attendance/')) return 'Attendance';
    if (this.router.url.includes('/section/')) return 'View Section';
    return '';
  }

  public goToSection() {
    let sectionId = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION_ID);

    this.sidenav.toggle();
    this.router.navigate(['/section', sectionId]);
  }

}
