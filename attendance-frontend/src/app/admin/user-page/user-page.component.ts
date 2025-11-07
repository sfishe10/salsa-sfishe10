import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../../../shared/models/user';
import {UserService} from '../../services/user.service';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Utilities} from '../../utilities/utilities';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Location } from '@angular/common';

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
    NgForOf,
    NgIf
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
  email: string = '';

  roleOptions: string[] = [];

  editing: boolean = false;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserById(this.userId).subscribe(user => {
      this.user = user;
    })

    this.roleOptions = Utilities.getRoleOptions();
  }

  edit() {
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    this.role = this.user.role;
    this.email = this.user.email;

    this.editing = true;
  }

  cancel() {
    this.editing = false;
  }

  updateUser(form: NgForm) {
    if (!this.user) {
      return;
    }

    const newUser = {
      userId: this.user.userId,
      email: form.value.email,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      role: form.value.role
    }

    this.userService.updateUser(newUser).subscribe(() => {
      this.user = newUser;
      this.openSnackBar("User updated!", "Ok", 3000);
      this.editing = false;
    }, error => {
      if (error.status === 409) {
        this.openSnackBar("Invalid email - already in use", "Ok", 3000);
      } else {
        console.log(error);
        this.openSnackBar("Error updating User", "Ok", 3000);
      }
    })
  }

  goBack() {
    this.location.back();
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }
}
