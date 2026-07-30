import {Component, OnInit} from '@angular/core';
import {Member} from '../models/member';
import {SessionCacheService} from '../services/session-cache.service';
import {Constants} from '../utilities/constants';
import {MemberService} from '../services/member.service';
import {NgForOf, NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-member-list-page',
  standalone: true,
  imports: [
    NgIf,
    MatTable,
    NgForOf,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIcon
  ],
  templateUrl: './member-list-page.component.html',
  styleUrl: './member-list-page.component.css'
})
export class MemberListPageComponent implements OnInit {
  sectionGroups: Array<[string, Member[]]> = [];

  membersLoaded: boolean = false;

  constructor(private sessionCacheService: SessionCacheService,
              private memberService: MemberService,
              private router: Router) {
  }

  ngOnInit() {
    const term = this.sessionCacheService.get(Constants.STORAGE_KEY_TERM);

    this.memberService.getMembersByTermId(term.termId).subscribe(members => {
      const map = new Map<string, Member[]>();

      for (let member of members) {
        let section = member.section?.name ?? '';
        let members = map.get(section) ?? [];

        members.push(member);
        map.set(section, members);
      }

      this.sectionGroups = Array.from(map.entries());
      this.membersLoaded = true;
    })
  }

  goToStationsList(memberId: number) {
    this.router.navigate(['/member', memberId, 'stations']);
  }

  goBack() {
    this.router.navigate(['/stations']);
  }

}
