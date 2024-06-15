import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isAuthenticated: boolean = false;
  private authSub!: Subscription;

  constructor(public authService: AuthService, private router: Router) {
    console.log("LoginComponent: Constructor initialized. AuthService injected.");
  }

  ngOnInit() {
    console.log("LoginComponent: ngOnInit started. Subscribing to authService.isLoggedIn$.");
    this.authSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log(`LoginComponent: Received isLoggedIn$ update: ${isLoggedIn}`);
      this.isAuthenticated = isLoggedIn;
      console.log(`LoginComponent: isAuthenticated set to ${this.isAuthenticated}.`);
      if (isLoggedIn) {
        console.log("LoginComponent: Redirecting to home because user is already logged in.");
        this.router.navigate(['/home']);
      }
    });
  }

  login() {
    console.log(`Attempting to login with email: ${this.email}`);
    if (!this.email || !this.password) {
      console.log("LoginComponent: Login attempt with missing credentials.");
      this.errorMessage = "Both email and password are required.";
      return;
    }
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('Login successful, navigating to home.');
        this.router.navigate(['/home']);
      },
      error: error => {
        console.error('Login failed:', error);
        this.errorMessage = error.error.message || 'Failed to login. Please try again.';
      }
    });
  }

  ngOnDestroy() {
    console.log("LoginComponent: ngOnDestroy called, unsubscribing from auth subscription.");
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
