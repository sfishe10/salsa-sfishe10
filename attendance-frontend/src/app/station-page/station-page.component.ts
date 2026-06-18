import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Member} from '../models/member';
import {FormsModule, NgForm} from '@angular/forms';
import {SessionCacheService} from '../services/session-cache.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Station} from '../models/station';
import {StationsService} from '../services/stations.service';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {StationEditComponent} from './station-edit/station-edit.component';

@Component({
  selector: 'app-station-page',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatButton,
    MatIcon,
    RouterLink,
    StationEditComponent
  ],
  templateUrl: './station-page.component.html',
  styleUrl: './station-page.component.css'
})
export class StationPageComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  station!: Station;

  stationId!: number;

  editing: boolean = false;

  // TODO: once we've added the ability to create new stations, implement this delete functionality
  // @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  // confirmDeleteDialogRef!: MatDialogRef<any>;
  //
  // @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  // successDialogRef!: MatDialogRef<any>;

  constructor(private route: ActivatedRoute,
              private stationService: StationsService,
              private router: Router,
              public sessionCacheService: SessionCacheService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.stationId = Number(this.route.snapshot.paramMap.get('id'));

    this.stationService.getStationById(this.stationId).subscribe(station => {
      console.log(station)
      this.station = station;
    })
  }

  edit() {


    this.editing = true;
  }

  save(form: NgForm) {
    if (!this.station) {
      return;
    }
    // let station = {
    //
    // } as Station

    // this.stationService.updateStation(station).subscribe(updatedStation => {
    //   this.station = station;
    //   this.openSnackBar("Station updated!", "Ok", 3000);
    //   this.editing = false;
    // }, error => {
    //   console.log(error);
    //   this.openSnackBar("Error updating station", "Ok", 3000);
    // })
  }

  cancel() {
    this.editing = false;
  }
  //
  // openConfirmationDialog() {
  //   this.confirmDeleteDialogRef = this.dialog.open(this.confirmDeleteDialog);
  // }
  //
  // openSuccessDialog() {
  //   this.successDialogRef = this.dialog.open(this.successDialog);
  // }
  //
  // cancelDialog() {
  //   this.dialog.closeAll();
  // }

  // deleteMember() {
  //   if (!this.station) {
  //     return;
  //   }
  //   this.cancelDialog();
  //   this.stationService.deleteMember(this.station).subscribe(() => {
  //     this.openSuccessDialog();
  //   }, error => {
  //     console.log(error);
  //     this.openSnackBar("Error deleting station", "Ok", 3000);
  //   })
  // }

  goBack() {
    // this.cancelDialog();
    this.router.navigate(['/admin']);
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
