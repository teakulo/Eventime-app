import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { AppEvent } from '../../models/AppEvent';
import { User } from '../../models/User';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event?: AppEvent;
  attendees: User[] = [];
  userId: string | null = null;
  isAttending: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEvent(eventId).subscribe(data => {
        this.event = data;
        if (data) {
          this.loadAttendees(data.id);
          this.userService.getCurrentUser().subscribe(user => {
            this.userId = user.id;
            this.checkAttendance(data.id, user.id);
          });
        }
      });
    }
  }

  loadAttendees(eventId: string): void {
    this.eventService.getAttendeesForEvent(eventId).subscribe(users => {
      this.attendees = users;
    });
  }

  checkAttendance(eventId: string, userId: string): void {
    this.userService.getUserById(userId).subscribe(user => {
      if (user && user.events_attending) {
        this.isAttending = user.events_attending.some(event => event.id === eventId);
      }
    });
  }

  toggleAttendance(): void {
    if (this.isAttending) {
      this.notAttendEvent();
    } else {
      this.attendEvent();
    }
  }

  attendEvent(): void {
    if (this.event && this.userId) {
      this.userService.attendEvent(this.event.id, this.userId).subscribe(() => {
        alert('You are now attending this event!');
        this.isAttending = true;
        this.loadAttendees(this.event!.id);
      });
    }
  }

  notAttendEvent(): void {
    if (this.event && this.userId) {
      this.userService.notAttendEvent(this.event.id, this.userId).subscribe(() => {
        alert('You are no longer attending this event.');
        this.isAttending = false;
        this.loadAttendees(this.event!.id);
      });
    }
  }

  addFriend(userId: string): void {
    if (this.userId) {
      this.userService.addFriend(this.userId, userId).subscribe(() => {
        alert('Friend added successfully!');
      });
    }
  }

  removeFriend(userId: string): void {
    if (this.userId) {
      this.userService.removeFriend(this.userId, userId).subscribe(() => {
        alert('Friend removed successfully!');
      });
    }
  }

  isFriend(user: User): boolean {
    let isFriend: boolean = false;
    this.userService.isFriend(this.userId!, user.id).subscribe(result => {
      isFriend = result;
    });
    return isFriend;
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
