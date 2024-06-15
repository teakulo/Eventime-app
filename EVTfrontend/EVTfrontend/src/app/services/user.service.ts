import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/current`);
  }

  attendEvent(eventId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/attend`, { eventId });
  }

  notAttendEvent(eventId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/not-attend`, { eventId });
  }

  getFriends(userId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${userId}/friends`);
  }

  addFriend(userId: string, friendId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/friends`, { friendId });
  }

  removeFriend(userId: string, friendId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/friends/${friendId}`);
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/isAuthenticated`);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  isFriend(userId: string, friendId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${userId}/isFriend/${friendId}`);
  }
}
