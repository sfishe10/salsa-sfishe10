import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Member} from '../../models/member';
import {MemberService} from '../../services/member.service';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MemberAttendanceTableComponent} from '../../shared/attendance-table/member-attendance-table.component';

@Component({
  selector: 'app-member-page',
  standalone: true,
  imports: [
    MatIcon,
    FormsModule,
    NgIf,
    MemberAttendanceTableComponent
  ],
  templateUrl: './member-page.component.html',
  styleUrl: './member-page.component.css'
})
export class MemberPageComponent implements OnInit {

  member: Member | null = null;

  memberId!: number

  constructor(private route: ActivatedRoute,
              private memberService: MemberService,
              private router: Router) {
  }

  ngOnInit() {
    this.memberId = Number(this.route.snapshot.paramMap.get('id'));

    this.memberService.getMemberById(this.memberId).subscribe(member => {
      this.member = member;
    })
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

}
