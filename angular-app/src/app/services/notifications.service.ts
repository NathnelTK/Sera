import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  notificationType: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getNotifications(unreadOnly = false): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications`, {
      params: unreadOnly ? { unreadOnly: 'true' } : {},
    });
  }

  markAsRead(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/notifications/${id}/read`, {});
  }
}
