import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgForOf, NgIf, NgStyle, TitleCasePipe} from '@angular/common';
import {StationGroup} from '../../models/station-group';
import {Station} from '../../models/station';
import {FormsModule, NgForm} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {StationPacket} from '../../models/station-packet';
import {ActivatedRoute, Router} from '@angular/router';
import {StationService} from '../../services/station.service';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-station-packet-list-page',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    NgIf,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatLabel,
    MatOption,
    MatSelect,
    TitleCasePipe
  ],
  templateUrl: './station-packet-list-page.component.html',
  styleUrl: './station-packet-list-page.component.css'
})
export class StationPacketListPageComponent implements OnInit{

  @ViewChild('addPacketDialog') addPacketDialog!: TemplateRef<any>;
  packetDialogRef!: MatDialogRef<any>;

  stationId!: number;
  station!: Station;

  titleText: string = '';
  role: string = '';

  roleOptions: string[] = ['instructor', 'evaluator', 'teacher'];
  showRoleRequiredError: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private stationService: StationService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.stationId = Number(this.route.snapshot.paramMap.get('id'));

    this.stationService.getStationById(this.stationId).subscribe(station => {
      this.station = station;
    })
  }

  addPacket() {
    this.packetDialogRef = this.dialog.open(this.addPacketDialog)
  }

  navigateToPacket(packetId: number) {
    this.router.navigate(['/packet', packetId]);
  }

  goBack() {
    // this.cancelDialog();
    this.router.navigate(['/station', this.station.stationId]);
  }

  onCancelDialog() {
    this.dialog.closeAll();
  }

  submitPacket(form: NgForm) {

  }
}
