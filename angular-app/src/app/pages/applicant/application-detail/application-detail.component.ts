import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ApplicationsStore } from '../../../stores/applications.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ConfirmDialogComponent } from '../../../core/layout/confirm-dialog/confirm-dialog.component';
import {
  APPLICATION_PROGRESS,
  ApplicationStatus,
  applicationStatusColor,
  applicationStatusKey,
  isTerminalStatus,
} from '../../../core/workflow/workflow';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.scss',
})
export class ApplicationDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appsStore = inject(ApplicationsStore);
  private dialog = inject(MatDialog);

  // Enum → i18n-key / colour helpers for the template.
  applicationStatusKey = applicationStatusKey;
  applicationStatusColor = applicationStatusColor;

  readonly id: string;

  isLoading = computed(() => this.appsStore.isLoading());
  error = computed(() => this.appsStore.error());
  app = computed(() => this.appsStore.currentApplication());

  /** True once the application has reached a terminal state (rejected / withdrawn). */
  isTerminal = computed(() => {
    const a = this.app();
    return !!a && isTerminalStatus(a.status);
  });

  /**
   * The forward pipeline rendered as timeline rows. A terminal application still shows the
   * pipeline (with at least "submitted" done) alongside a separate terminal badge.
   */
  steps = computed(() => {
    const a = this.app();
    if (!a) return [];
    const idx = APPLICATION_PROGRESS.indexOf(a.status);
    const currentIndex = idx >= 0 ? idx : 0;
    return APPLICATION_PROGRESS.map((status, i) => ({
      status,
      key: applicationStatusKey(status),
      done: i <= currentIndex,
      current: idx >= 0 && i === currentIndex,
    }));
  });

  /** Only applicants withdraw, and only before a decision is reached. */
  canWithdraw = computed(() => {
    const a = this.app();
    if (!a) return false;
    return (
      a.status === ApplicationStatus.Submitted ||
      a.status === ApplicationStatus.UnderReview ||
      a.status === ApplicationStatus.Shortlisted
    );
  });

  constructor() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    void this.appsStore.loadApplicationById(this.id);
  }

  async withdraw(): Promise<void> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      restoreFocus: true,
      data: {
        titleKey: 'wf.app.withdrawTitle',
        messageKey: 'wf.app.withdrawBody',
        confirmKey: 'wf.app.withdraw',
        danger: true,
      },
    });
    const ok = await firstValueFrom(ref.afterClosed());
    if (ok) {
      await this.appsStore.withdraw(this.id);
    }
  }
}
