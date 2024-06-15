import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  username: string | null = null;
  private timerSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to authentication status immediately
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isAuthenticated = isLoggedIn;
      this.username = this.authService.getUsername();
    });

    // Check authentication status periodically (every 5 seconds)
    this.timerSubscription = this.authService.isLoggedIn$.subscribe();
  }

  ngOnDestroy(): void {
    // Unsubscribe from timer when component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
