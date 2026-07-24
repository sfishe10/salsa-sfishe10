import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StationsTableComponent} from '../shared/stations-table/stations-table.component';
import {Location, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-station-list-page',
  standalone: true,
  imports: [
    StationsTableComponent,
    NgIf,
    MatIcon
  ],
  templateUrl: './station-list-page.component.html',
  styleUrl: './station-list-page.component.css'
})
export class StationListPageComponent implements OnInit {

  action: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.action = this.route.snapshot.queryParams['action'];
  }

  stationClicked(stationId: number) {
    this.router.navigate(['/station', stationId, 'packets'], {queryParams: {action: this.action}})
  }

  goBack() {
    this.location.back();
  }

}
