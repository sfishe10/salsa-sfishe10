import {Component, OnInit, viewChild, ViewChild} from '@angular/core';
import {Term} from '../../models/term';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../services/admin.service';
import {Utilities} from '../../utilities/utilities';
import {BaseComponent} from '../../base-component';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StationsProgressTableComponent} from '../../shared/stations-progress-table/stations-progress-table.component';
import {SessionCacheService} from '../../services/session-cache.service';
import {Constants} from '../../utilities/constants';

@Component({
  selector: 'app-stations-progress-page',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    FormsModule,
    StationsProgressTableComponent,
    NgIf
  ],
  templateUrl: './stations-progress-page.component.html',
  styleUrl: './stations-progress-page.component.css'
})
export class StationsProgressPageComponent extends BaseComponent implements OnInit {
  terms: Term[] = [];

  selectedTerm: Term | null = null;

  readonly tableComponent = viewChild(StationsProgressTableComponent)

  constructor(private route: ActivatedRoute,
              private adminService: AdminService,
              private sessionCacheService: SessionCacheService,
              private router: Router) {
    super();
  }

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
    this.tableComponent()?.initializeTerm(term.termId);
  }
}
