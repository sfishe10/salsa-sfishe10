import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionCacheService} from '../services/session-cache.service';
import {Constants} from '../utilities/constants';
import {Section} from '../../../../shared/models/section';
import {MemberService} from '../services/member.service';
import {MemberStats} from '../../../../shared/models/member-stats';
import {AttendanceService} from '../services/attendance.service';
import {SectionService} from '../services/section.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {EventsTableComponent} from '../admin/events-table/events-table.component';
import {AttendanceTableComponent} from "../admin/attendance-table/attendance-table.component";
import {Term} from '../../../../shared/models/term';
import {Utilities} from '../utilities/utilities';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-section-page',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    NgIf,
    DatePipe,
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
    MatHeaderCellDef,
    MatAccordion,
    EventsTableComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    AttendanceTableComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    FormsModule
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

  memberStats: MemberStats[] = [];
  statsColumns: string[] = ['member', 'numRehearsals', 'numWholeBandEvents', 'numPepEvents', 'numVolunteerEvents', 'numSubEvents'];

  @ViewChildren(AttendanceTableComponent) attendanceTables!: QueryList<AttendanceTableComponent>;

  constructor (private router: Router,
               private route: ActivatedRoute,
               public sessionCacheService: SessionCacheService,
               private attendanceService: AttendanceService,
               private sectionService: SectionService) {
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

    this.attendanceService.getMemberStatsBySectionId(section.sectionId).subscribe(memberStats => {
      this.memberStats = memberStats;
    })

  }

  protected readonly EVENT_TYPE_REHEARSAL = Constants.EVENT_TYPE_REHEARSAL;
  protected readonly EVENT_TYPE_WHOLE_BAND_EVENT = Constants.EVENT_TYPE_WHOLE_BAND_EVENT;
  protected readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT;
}
