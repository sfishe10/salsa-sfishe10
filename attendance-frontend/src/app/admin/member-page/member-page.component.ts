import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Member} from '../../models/member';
import {MemberService} from '../../services/member.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-member-page',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './member-page.component.html',
  styleUrl: './member-page.component.css'
})
export class MemberPageComponent implements OnInit {

  member: Member | null = null;

  constructor(private route: ActivatedRoute,
              private memberService: MemberService,
              private router: Router) {
  }

  ngOnInit() {
    const memberId = Number(this.route.snapshot.paramMap.get('id'));

    this.memberService.getMemberById(memberId).subscribe(member => {
      this.member = member;
    })
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

}
