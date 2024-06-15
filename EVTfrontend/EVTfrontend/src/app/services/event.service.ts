import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppEvent } from '../models/AppEvent';
import { AuthService } from './auth.service';
import { User } from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEvents(): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  getEvent(id: string): Observable<AppEvent> {
    return this.http.get<AppEvent>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createEvent(event: AppEvent): Observable<AppEvent> {
    return this.http.post<AppEvent>(`${this.apiUrl}`, event, { headers: this.getAuthHeaders() });
  }

  updateEvent(id: string, event: AppEvent): Observable<AppEvent> {
    return this.http.put<AppEvent>(`${this.apiUrl}/${id}`, event, { headers: this.getAuthHeaders() });
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getEventsByCreatorId(creatorId: string): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.apiUrl}/creator/${creatorId}`, { headers: this.getAuthHeaders() });
  }

  getEventsAttendedByUserId(userId: string): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.apiUrl}/attendee/${userId}`, { headers: this.getAuthHeaders() });
  }

  getAttendeesForEvent(eventId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${eventId}/attendees`, { headers: this.getAuthHeaders() });
  }
}
