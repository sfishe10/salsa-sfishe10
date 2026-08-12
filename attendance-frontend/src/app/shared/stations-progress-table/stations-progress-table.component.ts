import {Component, Input, OnInit} from '@angular/core';
import {SessionCacheService} from '../../services/session-cache.service';
import {Router} from '@angular/router';
import {EvaluationService} from '../../services/evaluation.service';
import {MemberStationStatus} from '../../models/member-station-status';
import {Station} from '../../models/station';
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
import {Constants} from '../../utilities/constants';
import {Utilities} from '../../utilities/utilities';
type MemberWithStationsStatus = {
  isSection: false;
  memberId: number;
  fullName: string;
  sectionName: string;
  stationsMap: { [stationId: number]: StatusCell }; // stationId -> status
};

type SectionRow = { isSection: true; sectionName: string };

type StatusCell = {
  attemptCount: number;
  status: string;
};

type TableRow = SectionRow | MemberWithStationsStatus;

@Component({
  selector: 'app-stations-progress-table',
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
    NgForOf,
    MatHeaderCellDef,
    NgClass,
    NgStyle
  ],
  templateUrl: './stations-progress-table.component.html',
  styleUrl: './stations-progress-table.component.css'
})
export class StationsProgressTableComponent implements OnInit {
  @Input('termId') termId!: number;

  @Input('sectionId') sectionId: number | null = null;

  isSectionRow = (index: number, row: TableRow): row is SectionRow => row.isSection;
  isMemberRow = (index: number, row: TableRow): row is MemberWithStationsStatus => !row.isSection;

  stations: Station[] = [];

  displayedColumns: string[] = ['name']; // add events later
  dataSource: TableRow[] = [];

  constructor(private evaluationService: EvaluationService,
              private sessionCacheService: SessionCacheService,
              private router: Router) {}

  ngOnInit() {
    this.initializeTerm(this.termId);
  }

  initializeTerm(termId: number) {
    this.termId = termId;

    if (this.sectionId) {
      this.evaluationService.getSectionStationsProgress(termId, this.sectionId).subscribe(statuses => {
        this.populateTable(statuses)
      })
    } else {
      this.evaluationService.getAllStationsProgress(termId).subscribe(statuses => {
        this.populateTable(statuses)
      })
    }
  }

  populateTable(statuses: MemberStationStatus[]) {
    const rows: TableRow[] = [];
    const grouped = new Map<string, MemberWithStationsStatus[]>(); // sectionName -> members

    this.stations = [];
    for (const record of statuses) {
      const fullName = `${record.memberFirst} ${record.memberLast}`;
      const sectionName = record.sectionName;

      const station = {
        stationId: record.stationId,
        title: record.stationTitle,
        level: record.stationLevel,
        class: record.stationClass
      } as Station

      this.stations.push(station);

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
          stationsMap: {}
        };
        sectionMembers.push(memberRow);
      }

      memberRow.stationsMap[record.stationId] = {
        attemptCount: record.attemptCount,
        status: record.status
      };
    }

    // remove duplicates in the stations array (since each station has many status records)
    this.stations = Array.from(
      new Map(this.stations.map(s => [s.stationId, s])).values()
    );

    // Build rows: section header + member rows
    for (const [sectionName, members] of grouped) {
      // only include the section headers if this is for the admin overview page (not if it's on the section page)
      if (!this.sectionId) {
        rows.push({ isSection: true, sectionName });
      }
      rows.push(...members);
    }

    this.dataSource = rows;
    this.displayedColumns = ['name', ...this.stations.map(s => s.stationId.toString())];

    // console.table(rows.map(r => ({
    //   isSection: r.isSection,
    //   sectionName: (r as SectionRow).sectionName,
    //   fullName: (r as MemberWithAttendance).fullName
    // })));
  }

  protected readonly Constants = Constants;
  protected readonly Utilities = Utilities;
}
