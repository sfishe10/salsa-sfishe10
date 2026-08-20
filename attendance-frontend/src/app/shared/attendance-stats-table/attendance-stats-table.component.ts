import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MemberStats} from '../../models/member-stats';
import {EventAttendanceTermPage} from '../../models/event-attendance-term-page';
import {AttendanceService} from '../../services/attendance.service';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {Utilities} from '../../utilities/utilities';
import {Constants} from '../../utilities/constants';
import {BaseComponent} from '../../base-component';

type SectionRow = { isSection: true; sectionName: string };

type MemberRow = {
  isSection: false;
  data: MemberStats;
}

type TableRow = SectionRow | MemberRow;

@Component({
  selector: 'app-attendance-stats-table',
  standalone: true,
  imports: [
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
    NgIf,
    MatIcon,
    MatIconButton,
    NgClass
  ],
  templateUrl: './attendance-stats-table.component.html',
  styleUrl: './attendance-stats-table.component.css'
})
export class AttendanceStatsTableComponent extends BaseComponent implements OnInit {
  @Input('termId') termId!: number;
  @Input('sectionId') sectionId: number | null = null;

  @Output() rowClicked = new EventEmitter<number>();

  @ViewChild('tableScrollContainer')
  tableScrollContainer!: ElementRef<HTMLDivElement>;

  unexcusedExpanded = false;
  pepEventsExpanded = false;

  unexcusedColumns = ['totalUnexcusedMisses', 'rehearsalsMissed', 'wholeBandEventsMissed', 'pepEventsMissed'];

  pepEventColumns = ['totalPepEventsAttended', 'assignedAbcEventsAttended', 'extraAbcEventsAttended', 'abcEventsSubbed', 'volunteerEventsAttended'];

  displayedColumns: string[] = [
    'member',
    ...this.unexcusedColumns,
    'wholeBandEventsAttended', 'rehearsalsAttended',
    ...this.pepEventColumns
  ]

  dataSource: TableRow[] = [];

  isSectionRow = (index: number, row: TableRow): row is SectionRow => row.isSection;

  constructor(private attendanceService: AttendanceService) {
    super();
  }

  ngOnInit() {
    this.initializeTerm(this.termId);
  }

  initializeTerm(termId: number) {
    this.termId = termId;

    if (this.sectionId) {
      this.attendanceService.getMemberStats(this.termId, this.sectionId).subscribe(memberStats => {
        this.populateTable(memberStats);
      })
    } else {
      this.attendanceService.getMemberStats(this.termId).subscribe(memberStats => {
        this.populateTable(memberStats);
      })
    }
  }

  onSectionChange(sectionId: number) {
    this.attendanceService.getMemberStats(this.termId, sectionId).subscribe(memberStats => {
      this.populateTable(memberStats);
    })
  }

  toggleUnexcusedColumns(): void {
    this.unexcusedExpanded = !this.unexcusedExpanded;

    // make sure the new columns are visible when expanded
    if (this.unexcusedExpanded) {
      setTimeout(() => {
        this.tableScrollContainer.nativeElement.scrollBy({
          left: 150,
          behavior: 'smooth'
        });
      });
    }
  }

  togglePepEventColumns(): void {
    this.pepEventsExpanded = !this.pepEventsExpanded;

    // make sure the new columns are visible when expanded
    if (this.pepEventsExpanded) {
      setTimeout(() => {
        this.tableScrollContainer.nativeElement.scrollBy({
          left: 150,
          behavior: 'smooth'
        });
      });
    }
  }

  onRowClicked(memberId: number) {
    this.rowClicked.emit(memberId);
  }

  populateTable(stats: MemberStats[]) {
    const rows: TableRow[] = [];
    const grouped = new Map<string, MemberRow[]>(); // sectionName -> members

    for (const record of stats) {
      const sectionName = record.sectionName;

      if (!grouped.has(sectionName)) {
        grouped.set(sectionName, []);
      }

      const sectionMembers = grouped.get(sectionName)!;
      let memberRow = sectionMembers.find(m => m.data.memberId === record.memberId);

      if (!memberRow) {
        memberRow = {
          isSection: false,
          data: record
        };
        sectionMembers.push(memberRow);
      }
    }

    // Build rows: section header + member rows
    for (const [sectionName, members] of grouped) {
      if (!this.sectionId) {
        rows.push({ isSection: true, sectionName });
      }
      rows.push(...members);
    }

    console.log(rows);
    this.dataSource = rows;
  }

  protected readonly Utilities = Utilities;
  protected readonly Constants = Constants;
}
