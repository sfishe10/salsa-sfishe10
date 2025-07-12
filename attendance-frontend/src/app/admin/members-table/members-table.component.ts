import {AfterViewInit, Component, inject, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Utilities} from '../../utilities/utilities';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {Member} from '../../models/member';
import {PepBand} from '../../models/pep-band';
import {Section} from '../../models/section';
import {FormsModule, NgForm} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {Term} from '../../models/term';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Constants} from '../../utilities/constants';
import {SessionCacheService} from '../../services/session-cache.service';
import {AdminService} from '../../services/admin.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-members-table',
  standalone: true,
  imports: [
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    FormsModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    MatHeaderCellDef,
    MatIcon,
    NgIf,
    MatIconButton
  ],
  templateUrl: './members-table.component.html',
  styleUrl: './members-table.component.css'
})
export class MembersTableComponent implements OnInit, AfterViewInit {

  private _snackBar = inject(MatSnackBar);

  rehearsalConflictOptions: string[] = Utilities.getRehearsalConflictOptions();

  @ViewChild('addMemberDialog') addMemberDialog!: TemplateRef<any>;
  memberDialogRef!: MatDialogRef<any>;

  @ViewChild('uploadCsvDialog') uploadCsvDialog!: TemplateRef<any>;
  uploadCsvDialogRef!: MatDialogRef<any>;

  sectionOptions: Section[] = [];
  pepBandOptions: PepBand[] = [];

  members: Member[] = [];
  memberColumns: string[] = ['email', 'name', 'pepBand', 'section'];
  memberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>(this.members);

  memberEmail: string = "";
  memberPepBand: PepBand | null = null;
  memberSection: Section | null = null;
  memberRehearsalConflict: string | null = null;

  @ViewChild('memberPaginator') memberPaginator: MatPaginator | null = null;

  @ViewChild('memberForm') memberForm!: NgForm;

  @Input('selectedTerm') selectedTerm?: Term | null = null;

  selectedFile: File | null = null;

  constructor(private adminService: AdminService,
              private dialog: MatDialog,
              private sessionCacheService: SessionCacheService) {
  }

  ngAfterViewInit() {
    this.memberDataSource.paginator = this.memberPaginator;
  }

  ngOnInit() {
    this.pepBandOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_PEP_BANDS);

    this.sectionOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTIONS);
  }

  openMemberDialog() {
    this.memberDialogRef = this.dialog.open(this.addMemberDialog);
  }

  onCancelDialog() {
    setTimeout(() => {
      this.memberForm?.reset();
    });
    this.selectedFile = null;
    this.dialog.closeAll();
  }

  onTermChange(newTermId: number) {
    this.adminService.getMembersByTermId(newTermId).subscribe(members => {
      this.members = members;
      console.log(members);
      this.memberDataSource = new MatTableDataSource<Member>(this.members);
      this.memberDataSource.paginator = this.memberPaginator;
    })
  }

  submitMember(form: NgForm) {
    let newMember = {
      email: form.value.memberEmail,
      pepBand: form.value.memberPepBand,
      section: form.value.memberSection,
      rehearsalConflict: form.value.memberRehearsalConflict,
      term: this.selectedTerm
    }

    this.adminService.createMember(newMember).subscribe((insertedMember: Member) => {
      this.members.push(insertedMember);
      this.memberDataSource = new MatTableDataSource(this.members);
      this.memberDataSource.paginator = this.memberPaginator;
      this.openSnackBar("Member added!", "Ok", 3000);
      setTimeout(() => {
        this.memberForm?.reset();
      });
      this.memberDialogRef.close();
    }, error => {
      if (error.status === 404) {
        this.openSnackBar("Invalid email - add User first", "Ok", 3000);
      } else {
        console.log(error);
        this.openSnackBar("Error adding Member", "Ok", 3000);
      }
    })
  }

  onUploadCsvClicked() {
    this.uploadCsvDialogRef = this.dialog.open(this.uploadCsvDialog);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    if (!this.selectedTerm) { return; }

    let termId = this.selectedTerm.termId;

    this.adminService.uploadMemberCsv(formData, termId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.onTermChange(termId);
        this.onCancelDialog();
        this.openSnackBar('Member added', 'OK', 3000);
      },
      error: (err: any) => {
        console.error('Upload error:', err)
        this.onCancelDialog();
        this.openSnackBar('Error uploading CSV', 'OK', 3000);
      },
    });
  }

  clearFile(fileInput: HTMLInputElement) {
    this.selectedFile = null;
    fileInput.value = '';
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }
}
