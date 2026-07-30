import {Component, inject, OnInit} from '@angular/core';
import {Constants} from '../utilities/constants';
import {NewEvaluation} from '../models/new-evaluation';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionCacheService} from '../services/session-cache.service';
import {EvaluationService} from '../services/evaluation.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Member} from '../models/member';
import {MemberStationStatus} from '../models/member-station-status';
import {StationsTableComponent} from '../shared/stations-table/stations-table.component';
import {MemberService} from '../services/member.service';
import {NgIf, UpperCasePipe} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-member-stations-status-page',
  standalone: true,
  imports: [
    StationsTableComponent,
    NgIf,
    UpperCasePipe,
    MatDivider,
    MatIcon
  ],
  templateUrl: './member-stations-status-page.component.html',
  styleUrl: './member-stations-status-page.component.css'
})
export class MemberStationsStatusPageComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  memberId!: number;
  member!: Member;

  memberLoaded: boolean = false;

  stationsStatuses: MemberStationStatus[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sessionCacheService: SessionCacheService,
              private evalService: EvaluationService,
              private memberService: MemberService) {
  }

  ngOnInit() {
    this.memberId = Number(this.route.snapshot.paramMap.get('id'));

    this.memberService.getMemberById(this.memberId).subscribe(member => {
      this.member = member;
      this.memberLoaded = true;
    })

    this.evalService.getMemberStationsStatus(this.memberId).subscribe(statuses => {
      this.stationsStatuses = statuses;
    })
  }

  startEvaluation(stationId: number) {
    const loggedInUserId = this.sessionCacheService.get(Constants.STORAGE_KEY_ME).member?.memberId;

    // start a new evaluation, or get an existing evaluation if one is in progress, and navigate to that page
    const newEval = {
      memberId: this.memberId,
      evaluatorId: loggedInUserId,
      stationId
    } as NewEvaluation
    this.evalService.startEval(newEval).subscribe(savedEval => {
      this.router.navigate(['/evaluation', savedEval.evalId]);
    }, error => {
      console.log(error);
      this.openSnackBar("Error starting evaluation", "Ok", 3000);
    })
  }

  goBack() {
    this.router.navigate(['/stations/evaluate']);
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
