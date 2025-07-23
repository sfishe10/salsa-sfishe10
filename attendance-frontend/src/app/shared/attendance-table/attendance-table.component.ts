import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {EventAttendanceMemberPage} from '../../models/event-attendance-member-page';
import {MBEvent} from '../../models/mb-event';
import {MemberService} from '../../services/member.service';

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
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef
  ],
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.css'
})
export class AttendanceTableComponent implements OnInit, AfterViewInit {

  @Input('memberId') memberId: number | null = null;

  @ViewChild('attendancePaginator') attendancePaginator: MatPaginator | null = null;

  attendances: EventAttendanceMemberPage[] = [];
  attendanceColumns: string[] = ['event', 'date', 'status', 'subbedBy'];
  attendanceDataSource: MatTableDataSource<EventAttendanceMemberPage> = new MatTableDataSource<EventAttendanceMemberPage>(this.attendances);

  constructor(private memberService: MemberService) {}

  ngOnInit() {
    if (this.memberId) {
      this.memberService.getMemberAttendances(this.memberId).subscribe(attendances => {
        this.attendances = attendances;
      })
    }

  }

  ngAfterViewInit() {
    this.attendanceDataSource.paginator = this.attendancePaginator;
  }


}
