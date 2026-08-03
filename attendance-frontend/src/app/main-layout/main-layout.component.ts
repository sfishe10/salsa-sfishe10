import {Component, DestroyRef, OnInit, ViewChild} from '@angular/core';
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
import {filter, map, startWith} from 'rxjs';
import {SessionCacheService} from '../services/session-cache.service';
import {Constants} from '../utilities/constants';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {LogoComponent} from '../logo/logo.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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

  pageTitle = '';

  isMobile: boolean = false;

  constructor(
    public sessionCacheService: SessionCacheService,
    public router: Router,
    public route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private responsive: BreakpointObserver) { };

  ngOnInit() {
    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe(result => {
      this.isMobile = result.matches;
    })

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null),
        map(() => this.getDeepestRoute(this.route)),
        map(route => route.snapshot.title ?? ''),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(title => {
        this.pageTitle = title;
      });
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  public goToSection() {
    let sectionId = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION).sectionId;

    this.sidenav?.toggle();
    this.router.navigate(['/section', sectionId]);
  }

  protected readonly STORAGE_KEY_SECTION = Constants.STORAGE_KEY_SECTION;
}
