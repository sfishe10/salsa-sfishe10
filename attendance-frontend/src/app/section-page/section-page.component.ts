import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionCacheService} from '../services/session-cache.service';
import {Constants} from '../utilities/constants';
import {Section} from '../models/section';
import {MemberService} from '../services/member.service';
import {MemberStats} from '../models/member-stats';
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
import {Term} from '../models/term';

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
    AttendanceTableComponent
  ],
  templateUrl: './section-page.component.html',
  styleUrl: './section-page.component.css'
})
export class SectionPageComponent implements OnInit {

  sectionId: number | null = null;

  section: Section | null = null;

  term!: Term;

  memberStats: MemberStats[] = [];
  statsColumns: string[] = ['member', 'numRehearsals', 'numWholeBandEvents', 'numPepEvents', 'numVolunteerEvents', 'numSubEvents'];

  constructor (private router: Router,
               private route: ActivatedRoute,
               private sessionCacheService: SessionCacheService,
               private attendanceService: AttendanceService,
               private sectionService: SectionService) {
  }

  ngOnInit() {
    this.sectionId = Number(this.route.snapshot.paramMap.get('id'));

    this.term = this.sessionCacheService.get(Constants.STORAGE_KEY_TERM);

    this.sectionService.getSectionById(this.sectionId).subscribe(section => {
      this.section = section;
    })

    this.attendanceService.getMemberStatsBySectionId(this.sectionId).subscribe(memberStats => {
      this.memberStats = memberStats;
    })
  }

  navigateToMember(memberId: number) {
    this.router.navigate(['/member', memberId], {queryParams: {returnTo: 'section'}});
  }

  protected readonly EVENT_TYPE_REHEARSAL = Constants.EVENT_TYPE_REHEARSAL;
  protected readonly EVENT_TYPE_WHOLE_BAND_EVENT = Constants.EVENT_TYPE_WHOLE_BAND_EVENT;
  protected readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT;
}
