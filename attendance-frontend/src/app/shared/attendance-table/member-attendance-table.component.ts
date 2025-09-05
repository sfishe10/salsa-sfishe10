import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
import {MemberService} from '../../services/member.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-member-attendance-table',
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
  templateUrl: './member-attendance-table.component.html',
  styleUrl: './member-attendance-table.component.css'
})
export class MemberAttendanceTableComponent implements OnInit {

  @Input('memberId') memberId?: number | null = null;

  @ViewChild('attendancePaginator') attendancePaginator: MatPaginator | null = null;

  @ViewChild(MatTable) attendanceTable!: MatTable<EventAttendanceMemberPage>;

  attendances: EventAttendanceMemberPage[] = [];
  attendanceColumns: string[] = ['event', 'date', 'status', 'subbedBy'];
  attendanceDataSource: MatTableDataSource<EventAttendanceMemberPage> = new MatTableDataSource<EventAttendanceMemberPage>(this.attendances);

  constructor(private memberService: MemberService,
              private router: Router) {}

  ngOnInit() {
    if (this.memberId) {
      this.memberService.getMemberAttendances(this.memberId).subscribe(attendances => {
        this.attendances = attendances;
        this.attendanceDataSource.data = this.attendances;
        this.attendanceDataSource.paginator = this.attendancePaginator;
      })
    }
  }

  navigateToAttendance(attendanceId: number) {
    this.router.navigate(['/attendance', attendanceId], {queryParams: {returnTo: 'member'}});
  }

}
