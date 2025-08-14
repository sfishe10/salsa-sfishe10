import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Member} from '../models/member';
import {MemberService} from '../services/member.service';
import {MatIcon} from '@angular/material/icon';
import {FormsModule, NgForm} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {MemberAttendanceTableComponent} from '../shared/attendance-table/member-attendance-table.component';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Section} from '../models/section';
import {PepBand} from '../models/pep-band';
import {Constants} from '../utilities/constants';
import {SessionCacheService} from '../services/session-cache.service';
import {Utilities} from '../utilities/utilities';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-member-page',
  standalone: true,
  imports: [
    MatIcon,
    FormsModule,
    NgIf,
    MemberAttendanceTableComponent,
    MatButton,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf
  ],
  templateUrl: './member-page.component.html',
  styleUrl: './member-page.component.css'
})
export class MemberPageComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  member: Member | null = null;

  memberId!: number

  editing: boolean = false;

  sectionOptions: Section[] = [];
  pepBandOptions: PepBand[] = [];
  rehearsalConflictOptions: string[] = Utilities.getRehearsalConflictOptions();

  section: Section | null = null;
  rehearsalConflict: string | null = null;
  pepBand: PepBand | null = null;

  constructor(private route: ActivatedRoute,
              private memberService: MemberService,
              private router: Router,
              private sessionCacheService: SessionCacheService) {
  }

  ngOnInit() {
    this.memberId = Number(this.route.snapshot.paramMap.get('id'));

    this.pepBandOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_PEP_BANDS);

    this.sectionOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTIONS);

    this.memberService.getMemberById(this.memberId).subscribe(member => {
      this.member = member;
    })
  }

  edit() {
    this.section = this.sectionOptions.find(s => s.sectionId == this.member?.section?.sectionId) ?? null;
    this.rehearsalConflict = this.member?.rehearsalConflict ?? null;
    this.pepBand = this.pepBandOptions.find(b => b.bandId == this.member?.pepBand?.bandId) ?? null;

    this.editing = true;
  }

  save(form: NgForm) {
    if (!this.member) {
      return;
    }
    let member = {
      memberId: this.member?.memberId,
      user: this.member?.user,
      section: form.value.section,
      pepBand: form.value.pepBand,
      rehearsalConflict: form.value.rehearsalConflict,
      term: this.member?.term
    }

    this.memberService.updateMember(member).subscribe(updatedMember => {
      this.member = updatedMember;
      this.openSnackBar("Member updated!", "Ok", 3000);
      this.editing = false;
    }, error => {
      console.log(error);
      this.openSnackBar("Error updating member", "Ok", 3000);
    })
  }

  cancel() {
    this.editing = false;
  }


  goBack() {
    this.router.navigate(['/admin']);
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
