import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'Application' | 'Interview' | 'Job' | 'System';
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  items: Notification[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getNotifications(unreadOnly = false): Observable<NotificationsResponse> {
    const url = unreadOnly 
      ? `${environment.apiUrl}/notifications?unreadOnly=true`
      : `${environment.apiUrl}/notifications`;
    
    return this.http.get<NotificationsResponse>(url);
  }

  markAsRead(notificationIds: string[]): Observable<any> {
    return this.http.put(`${environment.apiUrl}/notifications`, {
      notificationIds,
      markAsRead: true
    });
  }
}