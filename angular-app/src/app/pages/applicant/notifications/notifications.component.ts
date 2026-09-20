import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationsStore } from '../../../stores/notifications.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-notifications', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './notifications.component.html', styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  readonly store = inject(NotificationsStore);
  readonly loading = computed(() => this.store.isLoading());
  readonly error = computed(() => this.store.error());
  constructor() { void this.load(); }
  load() { return this.store.loadNotifications(false); }
  markRead(id: string) { void this.store.markAsRead(id); }
  markAllRead() { void this.store.markAllAsRead(); }
}
