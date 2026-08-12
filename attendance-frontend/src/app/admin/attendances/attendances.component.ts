import {Component, OnInit, viewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {AttendanceTableComponent} from '../attendance-table/attendance-table.component';
import {AdminService} from '../../services/admin.service';
import {Term} from '../../models/term';
import {NgForOf, NgIf} from '@angular/common';
import {Constants} from '../../utilities/constants';
import {Utilities} from '../../utilities/utilities';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {SessionCacheService} from '../../services/session-cache.service';

@Component({
  selector: 'app-attendances',
  standalone: true,
  imports: [
    MatTab,
    MatTabGroup,
    AttendanceTableComponent,
    NgIf,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    FormsModule,
  ],
  templateUrl: './attendances.component.html',
  styleUrl: './attendances.component.css'
})
export class AttendancesComponent implements OnInit {

  terms: Term[] = [];

  selectedTerm: Term | null = null;

  readonly attendanceTables = viewChildren(AttendanceTableComponent);

  constructor(private route: ActivatedRoute,
              private adminService: AdminService,
              private sessionCacheService: SessionCacheService,
              private router: Router) {}

  ngOnInit() {
    this.adminService.getTerms().subscribe(terms => {
      this.terms.push(...terms);

      const currentTerm = this.sessionCacheService.get(Constants.STORAGE_KEY_TERM);
      this.selectedTerm = this.terms.find(term => term.termId == currentTerm.termId) ?? null;

      if (this.selectedTerm) {
        this.onTermChange(this.selectedTerm);
      }
    })
  }

  onTermChange(term: Term) {
    this.selectedTerm = term;
    this.attendanceTables().forEach(table => table.initializeTerm(term.termId));
  }

  protected readonly EVENT_TYPE_REHEARSAL = Constants.EVENT_TYPE_REHEARSAL;
  protected readonly EVENT_TYPE_WHOLE_BAND_EVENT = Constants.EVENT_TYPE_WHOLE_BAND_EVENT;
  protected readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT;

}
