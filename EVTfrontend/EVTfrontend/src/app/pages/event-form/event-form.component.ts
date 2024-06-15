import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { AppEvent } from '../../models/AppEvent';
import { format } from 'date-fns';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  isEditing: boolean = false;
  eventForm: FormGroup;
  event: AppEvent = {
    id: '',
    name: '',
    description: '',
    start_time: new Date(),
    end_time: new Date(),
    venue: '',
    city: '',
    category: '',
    duration: '',
    genre: '',
    price: 0,
    creator: { id: '', email: '', firstName: '', lastName: '', nickname: '', bio: '', friends: [], role: '', events_attending: [] },
    attendees: []
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      venue: ['', Validators.required],
      city: ['', Validators.required],
      category: [''],
      duration: [''],
      genre: [''],
      price: [0]
    });
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.isEditing = true;
      console.log(`Editing event with ID: ${eventId}`);
      this.eventService.getEvent(eventId).subscribe(event => {
        console.log('Event data:', event);
        this.event = event;
        this.eventForm.patchValue(event);
      });
    }
  }

  onSubmit() {
    console.log('Submitting form...');
    if (this.eventForm.valid) {
      console.log('Form is valid:', this.eventForm.value);
      const currentUserId = this.authService.getCurrentUserId();
      if (currentUserId) {
        this.event.creator.id = currentUserId;
      }
      const formValue = { ...this.eventForm.value };
      formValue.start_time = format(new Date(formValue.start_time), "dd-MM-yyyy HH:mm:ss");
      formValue.end_time = format(new Date(formValue.end_time), "dd-MM-yyyy HH:mm:ss");

      if (this.isEditing) {
        console.log('Updating event with ID:', this.event.id, 'Data:', formValue);
        this.eventService.updateEvent(this.event.id, { ...formValue, creator: this.event.creator }).subscribe(() => {
          this.router.navigate(['/events']);
        });
      } else {
        console.log('Creating new event with data:', formValue);
        this.eventService.createEvent({ ...formValue, creator: this.event.creator }).subscribe(() => {
          this.router.navigate(['/events']);
        });
      }
    } else {
      console.log('Form is invalid:', this.eventForm.errors);
      this.logFormErrors(this.eventForm);
    }
  }

  private logFormErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors != null) {
        console.log('Key control: ' + key + ', errors: ', controlErrors);
      }
    });
  }
}
