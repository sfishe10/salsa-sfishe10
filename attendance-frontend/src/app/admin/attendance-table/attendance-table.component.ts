import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
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
import {Term} from '../../models/term';
import {AdminService} from '../../services/admin.service';
import {EventAttendanceHeader} from '../../models/event-attendance-header';
import {Constants} from '../../utilities/constants';
import {Utilities} from '../../utilities/utilities';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {PepBand} from '../../models/pep-band';
import {FormsModule} from '@angular/forms';
import {SessionCacheService} from '../../services/session-cache.service';
import {MatSlideToggle, MatSlideToggleChange} from '@angular/material/slide-toggle';
import {EventAttendanceTermPage} from '../../models/event-attendance-term-page';

type MemberWithAttendance = {
  isSection: false;
  memberId: number;
  fullName: string;
  sectionName: string;
  rehearsalConflict: string;
  attendanceMap: { [eventId: number]: string }; // eventId -> status
};

type SectionRow = { isSection: true; sectionName: string };

type TableRow = SectionRow | MemberWithAttendance;

@Component({
  selector: 'app-attendance-table',
  standalone: true,
  imports: [
    DatePipe,
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
    NgForOf,
    NgIf,
    NgStyle,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FormsModule,
    NgClass,
    MatSlideToggle,
  ],
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.css'
})
export class AttendanceTableComponent implements OnInit {

  @Input('term') term!: Term;

  @Input('eventType') eventType!: string;

  displayedColumns: string[] = ['name']; // add events later
  dataSource: TableRow[] = [];

  events: EventAttendanceHeader[] = [];

  pepBandOptions: PepBand[] = [];

  selectedPepBand: PepBand | null = null;

  ignoreMemberPepBand: boolean = false;

  isSectionRow = (index: number, row: TableRow): row is SectionRow => row.isSection;
  isMemberRow = (index: number, row: TableRow): row is MemberWithAttendance => !row.isSection;


  constructor(private adminService: AdminService,
              private sessionCacheService: SessionCacheService) {}

  ngOnInit() {

    if (this.eventType === Constants.EVENT_TYPE_PEP_EVENT) {
      this.pepBandOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_PEP_BANDS);
      this.selectedPepBand = this.pepBandOptions[0] ?? null;

      this.onPepBandChange(this.selectedPepBand);
    } else {
      let termId = this.term.termId;

      this.adminService.getAttendanceByTermId(termId, this.eventType).subscribe(attendances => {
        this.populateTable(attendances);
      })
    }

  }

  onPepBandChange(pepBand: PepBand) {
    let termId = this.term.termId;


    this.adminService.getAttendanceByTermIdAndPepBand(termId, pepBand.bandId, false).subscribe(attendances => {
      this.populateTable(attendances);
    })
  }

  toggleIncludeOtherPepBandMembers(event: MatSlideToggleChange) {
    this.ignoreMemberPepBand = event.checked;

    if (!this.selectedPepBand) {
      return;
    }

    this.adminService.getAttendanceByTermIdAndPepBand(this.term.termId, this.selectedPepBand.bandId, this.ignoreMemberPepBand).subscribe(attendances => {
      this.populateTable(attendances);
    })
  }

  populateTable(attendances: EventAttendanceTermPage[]) {
    const rows: TableRow[] = [];
    const grouped = new Map<string, MemberWithAttendance[]>(); // sectionName -> members

    this.events = [];
    for (const record of attendances) {
      const key = `${record.memberId}`;
      const fullName = `${record.memberFirstName} ${record.memberLastName}`;
      const sectionName = record.sectionName;

      const attendanceEvent = {
        eventId: record.eventId,
        title: record.eventTitle,
        date: record.eventDate
      }
      this.events.push(attendanceEvent);

      if (!grouped.has(sectionName)) {
        grouped.set(sectionName, []);
      }

      const sectionMembers = grouped.get(sectionName)!;
      let memberRow = sectionMembers.find(m => m.memberId === record.memberId);

      if (!memberRow) {
        memberRow = {
          isSection: false,
          memberId: record.memberId,
          fullName,
          sectionName,
          rehearsalConflict: record.rehearsalConflict,
          attendanceMap: {}
        };
        sectionMembers.push(memberRow);
      }

      memberRow.attendanceMap[record.eventId] = record.attendanceStatus;
    }

    // remove duplicates in the events array (since each event has many attendance records)
    this.events = Array.from(
      new Map(this.events.map(e => [e.eventId, e])).values()
    );

    // Build rows: section header + member rows
    for (const [sectionName, members] of grouped) {
      rows.push({ isSection: true, sectionName });
      rows.push(...members);
    }

    this.dataSource = rows;
    this.displayedColumns = ['name', ...this.events.map(e => e.eventId.toString())];

    console.table(rows.map(r => ({
      isSection: r.isSection,
      sectionName: (r as SectionRow).sectionName,
      fullName: (r as MemberWithAttendance).fullName
    })));
  }

  protected readonly Constants = Constants;
  protected readonly Utilities = Utilities;
}
