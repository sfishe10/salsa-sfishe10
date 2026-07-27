import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StationsTableComponent} from '../shared/stations-table/stations-table.component';
import {Location} from '@angular/common';
import {Member} from '../models/member';
import {EvaluationService} from '../services/evaluation.service';
import {SessionCacheService} from '../services/session-cache.service';
import {Constants} from '../utilities/constants';
import {NewEvaluation} from '../models/new-evaluation';
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
  evalMember?: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private evalService: EvaluationService,
              private sessionCacheService: SessionCacheService) {
  }

  ngOnInit() {
    this.action = this.route.snapshot.queryParams['action'];
    this.evalMember = Number(this.route.snapshot.queryParams['evalMember']);
  }

  stationClicked(stationId: number) {
    if (this.evalMember) {
      // start a new evaluation and navigate to that page
      const newEval = {
        memberId: this.evalMember,
        evaluatorId: this.sessionCacheService.get(Constants.STORAGE_KEY_ME).member.memberId,
        stationId
      } as NewEvaluation
      this.evalService.startNewEval(newEval).subscribe(savedEval => {
        this.router.navigate(['/evaluation', savedEval.evalId]);
      }, error => {
        console.log(error);
        this.openSnackBar("Error starting evaluation", "Ok", 3000);
      })
    } else {
      this.router.navigate(['/station', stationId, 'packets'], {queryParams: {action: this.action}});
    }

  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  goBack() {
    this.location.back();
  }

}
