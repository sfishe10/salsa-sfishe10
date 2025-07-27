import {Component, OnInit} from '@angular/core';
import {Member} from '../../models/member';
import {ActivatedRoute, Router} from '@angular/router';
import {MemberService} from '../../services/member.service';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {MatIcon} from '@angular/material/icon';
import {MemberAttendanceTableComponent} from '../../shared/attendance-table/member-attendance-table.component';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Utilities} from '../../utilities/utilities';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    MatIcon,
    NgIf,
    FormsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    NgForOf
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  user: User | null = null;

  userId!: number

  firstName: string = '';
  lastName: string = '';
  role: string = '';

  roleOptions: string[] = [];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserById(this.userId).subscribe(user => {
      this.user = user;

      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.role = user.role;
    })

    this.roleOptions = Utilities.getRoleOptions();
  }

  updateUser(userForm: NgForm) {

  }

  goBackToAdmin() {
    this.router.navigate(['/admin'])
  }
}
