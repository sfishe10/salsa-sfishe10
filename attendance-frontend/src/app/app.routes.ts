import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {MsalGuard, MsalRedirectComponent} from '@azure/msal-angular';
import {EventListComponent} from './event-list/event-list.component';
import {ProfileComponent} from './profile/profile.component';
import {AttendanceFormComponent} from './attendance-form/attendance-form.component';
import {UpcomingEventsComponent} from './upcoming-events/upcoming-events.component';
import {RecentEventsComponent} from './recent-events/recent-events.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/upcoming-events',
    pathMatch: 'full',
  },
  // {
  //     path: 'home',
  //     component: HomeComponent
  // },
  {
    path: 'upcoming-events',
    component: UpcomingEventsComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'recent-events',
    component: RecentEventsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'attendance-form/:id',
    component: AttendanceFormComponent
  },
  {
    path: 'auth-response',
    component: MsalRedirectComponent
  },
  {
    path: '**',
    redirectTo: '/upcoming-events',
  },
];
