import { Injectable, signal, computed, inject } from '@angular/core';
import { NotificationsService, Notification } from '../services/notifications.service';
import { firstValueFrom } from 'rxjs';

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
  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);
  unreadNotifications = computed(() => this.notifications().filter(n => !n.isRead));
  readNotifications = computed(() => this.notifications().filter(n => n.isRead));
  
  async loadNotifications(unreadOnly = false) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const response = await firstValueFrom(this.notificationsService.getNotifications(unreadOnly));
      this.notifications.set(response ?? []);
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load notifications');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async markAsRead(notificationId: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await firstValueFrom(this.notificationsService.markAsRead(notificationId));
      this.notifications.update(notifs => 
        notifs.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
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
    const unreadIds = this.notifications().filter(n => !n.isRead).map(n => n.id);
    for (const id of unreadIds) {
      if (!(await this.markAsRead(id))) return false;
    }
    return true;
  }
}
