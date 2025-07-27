import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Utilities} from '../../utilities/utilities';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    MatIcon,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  user!: User;

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

  updateUser(form: NgForm) {
    const newUser = {
      userId: this.user?.userId,
      email: this.user?.email,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      role: form.value.role
    }

    this.userService.updateUser(newUser).subscribe(() => {
      this.user = newUser;
      this.openSnackBar("User updated!", "Ok", 3000);
    }, error => {
      console.log(error);
      this.openSnackBar("Error updating user", "Ok", 3000);
    })
  }

  goBackToAdmin() {
    this.router.navigate(['/admin'])
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }
}
