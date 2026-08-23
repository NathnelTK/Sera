import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApplicationsStore } from '../../../stores/applications.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { applicationStatusColor, applicationStatusKey } from '../../../core/workflow/workflow';

@Component({
  selector: 'app-applications',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
})
export class ApplicationsComponent {
  private appsStore = inject(ApplicationsStore);

  // Enum → i18n-key / colour helpers for the template.
  applicationStatusKey = applicationStatusKey;
  applicationStatusColor = applicationStatusColor;

  isLoading = computed(() => this.appsStore.isLoading());
  error = computed(() => this.appsStore.error());
  applications = computed(() => this.appsStore.applications());
  hasApplications = computed(() => this.appsStore.hasApplications());

  constructor() {
    // The applicant guard guarantees an authenticated job seeker here.
    void this.appsStore.loadMyApplications();
  }

  reload(): void {
    void this.appsStore.loadMyApplications();
  }
}
