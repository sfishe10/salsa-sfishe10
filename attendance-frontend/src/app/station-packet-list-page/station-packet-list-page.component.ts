import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf, TitleCasePipe, UpperCasePipe} from '@angular/common';
import {Station} from '../models/station';
import {FormsModule, NgForm} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {StationPacket} from '../models/station-packet';
import {ActivatedRoute, Router} from '@angular/router';
import {StationService} from '../services/station.service';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import { Location } from '@angular/common';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-station-packet-list-page',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    NgIf,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatLabel,
    MatOption,
    MatSelect,
    TitleCasePipe,
    MatDivider,
    UpperCasePipe
  ],
  templateUrl: './station-packet-list-page.component.html',
  styleUrl: './station-packet-list-page.component.css'
})
export class StationPacketListPageComponent implements OnInit{

  @ViewChild('addPacketDialog') addPacketDialog!: TemplateRef<any>;
  packetDialogRef!: MatDialogRef<any>;

  stationId!: number;
  station!: Station;
  action: string = '';

  packets: StationPacket[] = [];

  title: string = '';
  role: string = '';

  roleOptions: string[] = ['instructor', 'evaluator', 'teacher'];

  showAddButton: boolean = false;

  isMobile: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private stationService: StationService,
              private dialog: MatDialog,
              private location: Location,
              private responsive: BreakpointObserver) {
  }

  ngOnInit() {
    this.stationId = Number(this.route.snapshot.paramMap.get('id'));

    this.action = this.route.snapshot.queryParams['action'];

    this.stationService.getStationById(this.stationId).subscribe(station => {
      this.station = station;
      this.packets = station.packets;

      if (this.action === 'lead') {
        this.packets = this.packets.filter(packet => packet.role === 'instructor');
      } else if (this.action === 'edit') {
        this.showAddButton = true;
      }
    });

    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe(result => {
      this.isMobile = result.matches;
    })
  }

  addPacket() {
    this.packetDialogRef = this.dialog.open(this.addPacketDialog)
  }

  navigateToPacket(packetId: number) {
    this.router.navigate(['/packet', packetId], {queryParams: {action: this.action}});
  }

  goBack() {
    this.cancelDialog();
    this.location.back();
  }

  cancelDialog() {
    this.dialog.closeAll();
  }

  submitPacket(form: NgForm) {
    let packet = {
      role: form.value.role,
      title: form.value.title,
      station: this.station
    } as StationPacket;

    this.stationService.createPacket(packet).subscribe(newPacket => {
      this.router.navigate(['/packet', newPacket.packetId]);
      this.dialog.closeAll();
    })
  }
}
