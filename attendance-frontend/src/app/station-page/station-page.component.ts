import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms';
import {SessionCacheService} from '../services/session-cache.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Station} from '../models/station';
import {StationService} from '../services/station.service';
import {NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {StationContentsComponent} from '../shared/station-contents/station-contents.component';
import {MatFormField, MatInput} from '@angular/material/input';
import {StationGroup} from '../models/station-group';
import {StationPacketListComponent} from '../shared/station-packet-list/station-packet-list.component';

@Component({
  selector: 'app-station-page',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatButton,
    MatIcon,
    RouterLink,
    StationContentsComponent,
    MatFormField,
    MatInput,
    MatIconButton,
    StationPacketListComponent
  ],
  templateUrl: './station-page.component.html',
  styleUrl: './station-page.component.css'
})
export class StationPageComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  station!: Station;

  stationId!: number;

  editing: boolean = false;

  editedStation!: Station;

  deleteGroupIds: number[] = [];
  deleteItemIds: number[] = [];

  editingTitle: boolean = false;
  stationTitleText: string = '';

  // TODO: once we've added the ability to create new stations, implement this delete functionality
  // @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  // confirmDeleteDialogRef!: MatDialogRef<any>;
  //
  // @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  // successDialogRef!: MatDialogRef<any>;

  @ViewChild(StationContentsComponent) contentsComponent!: StationContentsComponent;

  constructor(private route: ActivatedRoute,
              private stationService: StationService,
              private router: Router,
              public sessionCacheService: SessionCacheService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.stationId = Number(this.route.snapshot.paramMap.get('id'));

    this.stationService.getStationById(this.stationId).subscribe(station => {
      this.station = station;
      // use a deep copy so if edits are made, the original is not affected
      this.editedStation = JSON.parse(JSON.stringify(station));
    })
  }

  edit() {
    this.editing = true;
  }

  startEditingTitle() {
    this.editingTitle = true;
    this.stationTitleText = this.editedStation.title;
  }

  saveTitle() {
    this.editedStation.title = this.stationTitleText;
    this.stationTitleText = '';
    this.editingTitle = false;
  }

  cancelEditingTitle() {
    this.editedStation.title = this.station.title;
    this.editingTitle = false;
  }

  addItemToDelete(itemId: number) {
    this.deleteItemIds.push(itemId);
  }

  addGroupToDelete(groupId: number) {
    this.deleteGroupIds.push(groupId);
  }

  save() {
    if (!this.station) {
      return;
    }

    this.editingTitle = false;

    this.contentsComponent.updateLevels();

    this.stationService.updateStation(this.editedStation, this.deleteGroupIds, this.deleteItemIds).subscribe(updatedStation => {
      this.station = updatedStation;
      // use a deep copy so if edits are made, the original is not affected
      this.editedStation = JSON.parse(JSON.stringify(updatedStation));
      this.openSnackBar("Station updated!", "Ok", 3000);
      this.editing = false;
    }, error => {
      console.log(error);
      this.openSnackBar("Error updating station", "Ok", 3000);
    })
  }

  cancel() {
    this.editedStation = JSON.parse(JSON.stringify(this.station));
    this.deleteGroupIds = [];
    this.deleteItemIds = [];
    this.cancelEditingTitle();
    this.editing = false;
  }

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

  // deleteStation() {
  //   if (!this.station) {
  //     return;
  //   }
  //   this.cancelDialog();
  //   this.stationService.deleteStation(this.station).subscribe(() => {
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
