import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SessionCacheService} from '../services/session-cache.service';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {StationPacket} from '../models/station-packet';
import {StationService} from '../services/station.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import { Location } from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {Station} from '../models/station';
import {BaseComponent} from '../base-component';
import {QuillEditorComponent} from 'ngx-quill';

@Component({
  selector: 'app-station-packet-page',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatDialogActions,
    MatDialogTitle,
    MatInput,
    MatIconButton,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    TitleCasePipe,
    QuillEditorComponent,
  ],
  templateUrl: './station-packet-page.component.html',
  styleUrl: './station-packet-page.component.css'
})
export class StationPacketPageComponent extends BaseComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  packetId!: number;
  packet: StationPacket | null = null;

  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  confirmDeleteDialogRef!: MatDialogRef<any>;

  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  successDialogRef!: MatDialogRef<any>;

  editing: boolean = false;

  editingTitle: boolean = false;

  title: string = '';
  content: string = '';
  role: string = '';
  info: string = '';

  roleOptions: string[] = ['instructor', 'evaluator', 'teacher'];
  showRoleRequiredError: boolean = false;

  action: string = '';

  showEditButton: boolean = false;

  constructor(private route: ActivatedRoute,
              public sessionCacheService: SessionCacheService,
              private stationService: StationService,
              private dialog: MatDialog,
              private location: Location) {
    super();
  }

  ngOnInit() {
    this.packetId = Number(this.route.snapshot.paramMap.get('id'));
    this.action = this.route.snapshot.queryParams['action'];

    this.stationService.getPacketById(this.packetId).subscribe(packet => {
      this.packet = packet;
      this.title = packet.title;
      this.content = packet.content;
      this.role = packet.role;

      console.log(this.content);
    })
  }

  // needed in order to preserve spacing and newlines
  get displayContent(): string {
    return this.content
      .replace(/&nbsp;/g, ' ')
      .replace(/<p><\/p>/g, '<p><br></p>');
  }

  edit() {
    this.editing = true;
  }

  startEditingTitle() {
    this.editingTitle = true;
  }

  saveTitle() {
    this.editingTitle = false;
  }

  cancelEditingTitle() {
    this.title = this.packet?.title ?? '';
    this.editingTitle = false;
  }

  save(form: NgForm) {
    this.showRoleRequiredError = false;

    if (!this.packet) {
      return;
    }

    if (!this.role || !this.role.length) {
      this.showRoleRequiredError = true;
      return;
    }

    this.editingTitle = false;

    let packet = {
      packetId: this.packetId,
      station: {stationId: this.packet.station.stationId} as Station,
      title: this.title,
      role: this.role,
      content: this.content
    } as StationPacket

    this.stationService.updatePacket(packet).subscribe(updatedPacket => {
      this.packet = updatedPacket;
      this.openSnackBar("Packet updated!", "Ok", 3000);
      this.editing = false;
    }, error => {
      console.log(error);
      this.openSnackBar("Error updating packet", "Ok", 3000);
    })
  }

  cancel() {
    this.showRoleRequiredError = false;
    this.content = this.packet?.content ?? '';
    this.cancelEditingTitle();
    this.editing = false;
  }

  openConfirmationDialog() {
    this.confirmDeleteDialogRef = this.dialog.open(this.confirmDeleteDialog);
  }

  openSuccessDialog() {
    this.successDialogRef = this.dialog.open(this.successDialog);
  }

  cancelDialog() {
    this.dialog.closeAll();
  }

  deletePacket() {
    if (!this.packet) {
      return;
    }
    this.cancelDialog();
    this.stationService.deletePacket(this.packetId).subscribe(() => {
      this.openSuccessDialog();
    }, error => {
      console.log(error);
      this.openSnackBar("Error deleting packet", "Ok", 3000);
    })
  }

  goBack() {
    this.cancelDialog();
    this.location.back();
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  insertTab(event: any) {
    event.preventDefault();

    const el = event.target as HTMLTextAreaElement;
    el.setRangeText('\t', el.selectionStart, el.selectionEnd, 'end');
    this.content = el.value;
  }
}
