import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  user?: User;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  onSubmit(): void {
    if (this.user) {
      this.userService.updateUser(this.user.id, this.user).subscribe(updatedUser => {
        this.user = updatedUser;
        alert('Profile updated successfully!');
      });
    }
  }
}
