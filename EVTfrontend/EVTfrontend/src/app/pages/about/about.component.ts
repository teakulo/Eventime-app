import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.isAuthenticated().subscribe((auth: boolean) => {
      this.isAuthenticated = auth;
    });
  }
}
