import { Injectable, signal, computed, inject } from '@angular/core';
import { NotificationsService, Notification, NotificationsResponse } from '../services/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStore {
  private notificationsService = inject(NotificationsService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  notifications = signal<Notification[]>([]);
  
  // Computed
  hasNotifications = computed(() => this.notifications().length > 0);
  unreadCount = computed(() => this.notifications().filter(n => !n.is_read).length);
  unreadNotifications = computed(() => this.notifications().filter(n => !n.is_read));
  readNotifications = computed(() => this.notifications().filter(n => n.is_read));
  
  async loadNotifications(unreadOnly = false) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const response = await this.notificationsService.getNotifications(unreadOnly).toPromise();
      if (response) {
        this.notifications.set(response.items);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load notifications');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async markAsRead(notificationIds: string[]) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.notificationsService.markAsRead(notificationIds).toPromise();
      this.notifications.update(notifs => 
        notifs.map(n => notificationIds.includes(n.id) ? { ...n, is_read: true } : n)
      );
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to mark notifications as read');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async markAllAsRead() {
    const unreadIds = this.notifications().filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length > 0) {
      return this.markAsRead(unreadIds);
    }
    return true;
  }
}