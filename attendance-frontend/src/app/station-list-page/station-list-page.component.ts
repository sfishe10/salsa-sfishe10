import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StationsTableComponent} from '../shared/stations-table/stations-table.component';
import {Location} from '@angular/common';
import {SessionCacheService} from '../services/session-cache.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-station-list-page',
  standalone: true,
  imports: [
    StationsTableComponent,
  ],
  templateUrl: './station-list-page.component.html',
  styleUrl: './station-list-page.component.css'
})
export class StationListPageComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  action: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private sessionCacheService: SessionCacheService) {
  }

  ngOnInit() {
    this.action = this.route.snapshot.queryParams['action'];
  }

  stationClicked(stationId: number) {
    this.router.navigate(['/station', stationId, 'packets'], {queryParams: {action: this.action}});
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  goBack() {
    this.location.back();
  }

}
