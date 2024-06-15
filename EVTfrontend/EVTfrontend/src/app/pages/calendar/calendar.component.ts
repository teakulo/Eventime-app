import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AppEvent } from '../../models/AppEvent';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  user: User | undefined;
  events: AppEvent[] = [];
  calendar: any[][] = [];
  month: number;
  year: number;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
  }

  ngOnInit(): void {
    const currentUserId = this.authService.getCurrentUserId();
    console.log(`AuthService: Current user ID: ${currentUserId}`);
    if (currentUserId) {
      console.log(`Fetching data for user ID: ${currentUserId}`);
      this.userService.getUserById(currentUserId).subscribe(user => {
        if (user) {
          console.log('User data:', user);
          this.user = user;
          this.events = user.events_attending || []; // Ensure events is an array
          this.generateCalendar();
        } else {
          console.log('No user data found.');
        }
      });
    } else {
      console.log('No user ID found.');
    }
  }

  generateCalendar(): void {
    const firstDay = new Date(this.year, this.month, 1).getDay() || 7; // Adjust for Monday start
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    let day = 1;
    this.calendar = [];
    for (let i = 0; i < 6; i++) {
      this.calendar[i] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay - 1) {
          this.calendar[i][j] = null;
        } else if (day > daysInMonth) {
          this.calendar[i][j] = null;
        } else {
          this.calendar[i][j] = new Date(this.year, this.month, day);
          day++;
        }
      }
    }
  }

  getEventsForDate(date: Date): AppEvent[] {
    return this.events.filter(event =>
      new Date(event.start_time).toDateString() === date.toDateString()
    );
  }

  viewEventDetails(eventId: string): void {
    console.log(`Navigating to event ID: ${eventId}`);
    this.router.navigate(['/events', eventId]);
  }

  previousMonth(): void {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.generateCalendar();
  }

  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  }
}
