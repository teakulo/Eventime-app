import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AppEvent } from '../../models/AppEvent';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  events: AppEvent[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  viewEventDetails(eventId: string): void {
    this.router.navigate(['/event-details', eventId]);
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/event-form', eventId]);
  }

  deleteEvent(eventId: string): void {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.events = this.events.filter(event => event.id !== eventId);
    });
  }
}
