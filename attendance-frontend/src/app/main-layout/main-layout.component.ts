import {Component,OnInit, ViewChild} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet
} from "@angular/router";
import {filter} from 'rxjs';
import {SessionCacheService} from '../services/session-cache.service';
import {Constants} from '../utilities/constants';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {LogoComponent} from '../logo/logo.component';

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
    RouterOutlet,
    MatAnchor,
    LogoComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{

  @ViewChild('sidenav') sidenav: any;

  eventType: string = 'upcoming'; // default

  isMobile: boolean = false;

  constructor(
    public sessionCacheService: SessionCacheService,
    public router: Router,
    public route: ActivatedRoute,
    private responsive: BreakpointObserver) { };

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.route.queryParams.subscribe(params => {
          this.eventType = params['type'] || 'upcoming';
        });
      });

    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe(result => {
      this.isMobile = result.matches;
    })
  }

  get pageTitle(): string {
    if (this.router.url.startsWith('/events')) {
      return this.eventType === 'upcoming' ? 'Upcoming Events' : 'Recent Events';
    }
    if (this.router.url.includes('/stations')) return 'Stations';
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
    let sectionId = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION).sectionId;

    this.sidenav?.toggle();
    this.router.navigate(['/section', sectionId]);
  }

  protected readonly STORAGE_KEY_SECTION = Constants.STORAGE_KEY_SECTION;
}
