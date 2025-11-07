import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {AttendanceTableComponent} from '../attendance-table/attendance-table.component';
import {AdminService} from '../../services/admin.service';
import {Term} from '../../../../../shared/models/term';
import {NgIf} from '@angular/common';
import {Constants} from '../../utilities/constants';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-attendances',
  standalone: true,
  imports: [
    MatTab,
    MatTabGroup,
    AttendanceTableComponent,
    NgIf,
    MatIcon,
  ],
  templateUrl: './attendances.component.html',
  styleUrl: './attendances.component.css'
})
export class AttendancesComponent implements OnInit {

  public term!: Term;

  constructor(private route: ActivatedRoute,
              private adminService: AdminService,
              private router: Router) {}

  ngOnInit() {
    let termId = Number(this.route.snapshot.paramMap.get('id'));

    this.adminService.getTermById(termId).subscribe(term => {
      this.term = term;
    })
  }

  goBackToAdmin() {
    this.router.navigate(['/admin'])
  }

  protected readonly EVENT_TYPE_REHEARSAL = Constants.EVENT_TYPE_REHEARSAL;
  protected readonly EVENT_TYPE_WHOLE_BAND_EVENT = Constants.EVENT_TYPE_WHOLE_BAND_EVENT;
  protected readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT;

}
