import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionCacheService} from '../services/session-cache.service';
import {Constants} from '../utilities/constants';
import {Section} from '../models/section';
import {MemberStats} from '../models/member-stats';
import {AttendanceService} from '../services/attendance.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {AttendanceTableComponent} from "../admin/attendance-table/attendance-table.component";
import {Term} from '../models/term';
import {Utilities} from '../utilities/utilities';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {PepBand} from '../models/pep-band';
import {PepBandService} from '../services/pep-band.service';
import {MatDivider} from '@angular/material/divider';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-section-page',
  standalone: true,
  imports: [
    NgIf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    AttendanceTableComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    FormsModule,
    MatDivider,
    MatTabGroup,
    MatTab
  ],
  templateUrl: './section-page.component.html',
  styleUrl: './section-page.component.css'
})
export class SectionPageComponent implements OnInit {

  sectionId: number | null = null;

  public selectedSection: Section | null = null;

  sectionName: string = '';

  term!: Term;

  public sectionOptions: Section[] = [];

  public pepBands: PepBand[] = [];

  memberColumns: string[] = ['email', 'name'];

  memberStats: MemberStats[] = [];
  statsColumns: string[] = ['member', 'numRehearsals', 'numWholeBandEvents', 'numPepEvents', 'numVolunteerEvents', 'numSubEvents'];

  allowSectionSelection: boolean = false;

  @ViewChildren(AttendanceTableComponent) attendanceTables!: QueryList<AttendanceTableComponent>;

  constructor (private router: Router,
               private route: ActivatedRoute,
               public sessionCacheService: SessionCacheService,
               private attendanceService: AttendanceService,
               private pepBandService: PepBandService) {
  }

  ngOnInit() {
    this.sectionId = Number(this.route.snapshot.paramMap.get('id'));

    this.term = this.sessionCacheService.get(Constants.STORAGE_KEY_TERM);

    let mySection = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION);

    this.sectionOptions = (Utilities.isDrumline(mySection) && !this.sessionCacheService.isOfficer())
      ? this.sessionCacheService.get(Constants.STORAGE_KEY_SECTIONS).filter((section: Section) => Utilities.isDrumline(section))
      : this.sessionCacheService.get(Constants.STORAGE_KEY_SECTIONS);

    this.selectedSection = this.sectionOptions
      .find((s: Section) => s.sectionId == this.sectionId) ?? null;

    this.attendanceService.getMemberStatsBySectionId(this.sectionId).subscribe(memberStats => {
      this.memberStats = memberStats;
    })

    this.pepBandService.getAllWithSectionMembers(this.sectionId, this.term.termId).subscribe(pepBands => {
      this.pepBands = pepBands.filter(band => band.bandId != Constants.PEP_BAND_ID_VOLUNTEER);
    })

    if (this.sessionCacheService.isAdmin()
      || this.sessionCacheService.isOfficer()
      || this.sessionCacheService.isDrumlineAttendanceTaker()) {
      this.allowSectionSelection = true;
    }
  }

  navigateToMember(memberId: number) {
    this.router.navigate(['/member', memberId], {queryParams: {returnTo: 'section'}});
  }

  onSectionChange(section: Section) {
    this.sectionId = section.sectionId;

    this.attendanceTables.forEach(table => {
      table.onSectionChange(section.sectionId);
    })

    this.selectedSection = this.sectionOptions
      .find((s: Section) => s.sectionId == section.sectionId) ?? null;

    this.pepBandService.getAllWithSectionMembers(this.sectionId, this.term.termId).subscribe(pepBands => {
      this.pepBands = pepBands.filter(band => band.bandId != Constants.PEP_BAND_ID_VOLUNTEER);
    })

    this.attendanceService.getMemberStatsBySectionId(section.sectionId).subscribe(memberStats => {
      this.memberStats = memberStats;
    })

  }

  protected readonly EVENT_TYPE_REHEARSAL = Constants.EVENT_TYPE_REHEARSAL;
  protected readonly EVENT_TYPE_WHOLE_BAND_EVENT = Constants.EVENT_TYPE_WHOLE_BAND_EVENT;
  protected readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT;
}
