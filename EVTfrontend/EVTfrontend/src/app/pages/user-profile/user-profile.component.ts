import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { User } from '../../models/User';
import { AppEvent } from '../../models/AppEvent';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user?: User;
  eventsCreated: AppEvent[] = [];
  eventsAttending: AppEvent[] = [];
  friends: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
        this.loadUserDetails(user.id);
      });
    }
  }

  loadUserDetails(userId: string): void {
    this.eventService.getEventsByCreatorId(userId).subscribe(events => {
      this.eventsCreated = events;
    });

    this.eventService.getEventsAttendedByUserId(userId).subscribe(events => {
      this.eventsAttending = events;
    });

    this.userService.getFriends(userId).subscribe(friends => {
      this.friends = friends;
    });
  }

  removeFriend(friendId: string): void {
    if (this.user) {
      this.userService.removeFriend(this.user.id, friendId).subscribe(() => {
        alert('Friend removed successfully!');
        this.loadUserDetails(this.user!.id);
      });
    }
  }
}
