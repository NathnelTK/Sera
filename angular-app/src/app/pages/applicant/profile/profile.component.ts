import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ApplicantProfile, ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profiles = inject(ProfileService);

  readonly profile = signal<ApplicantProfile | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);

  readonly completion = computed(() => {
    const profile = this.profile();
    if (!profile) return 0;
    const checks = [
      Boolean(profile.firstName && profile.lastName),
      Boolean(profile.headline),
      Boolean(profile.summary),
      Boolean(profile.phone),
      Boolean(profile.avatarUrl),
      profile.skills.length > 0,
      profile.educations.length > 0,
      profile.experiences.length > 0,
      Boolean(profile.linkedInUrl || profile.gitHubUrl || profile.portfolioUrl),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  });

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    headline: ['', Validators.maxLength(200)],
    summary: ['', Validators.maxLength(2000)],
    phone: ['', Validators.maxLength(30)],
    avatarUrl: ['', Validators.maxLength(500)],
    linkedInUrl: ['', Validators.maxLength(500)],
    gitHubUrl: ['', Validators.maxLength(500)],
    portfolioUrl: ['', Validators.maxLength(500)],
    locationCity: ['', Validators.maxLength(150)],
    locationCountry: ['', Validators.maxLength(150)],
    locationState: ['', Validators.maxLength(150)],
    locationPostalCode: ['', Validators.maxLength(30)],
    isOpenToWork: [false],
  });

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const profile = await firstValueFrom(this.profiles.getMyApplicantProfile());
      this.profile.set(profile);
      this.patchForm(profile);
    } catch {
      this.error.set('profile.error.load');
    } finally {
      this.loading.set(false);
    }
  }

  startEditing(): void {
    const profile = this.profile();
    if (profile) this.patchForm(profile);
    this.saved.set(false);
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.editing.set(false);
    this.saved.set(false);
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    try {
      const value = this.form.getRawValue();
      await firstValueFrom(this.profiles.updateMyApplicantProfile({
        firstName: value.firstName!.trim(),
        lastName: value.lastName!.trim(),
        headline: this.optional(value.headline),
        summary: this.optional(value.summary),
        phone: this.optional(value.phone),
        avatarUrl: this.optional(value.avatarUrl),
        linkedInUrl: this.optional(value.linkedInUrl),
        gitHubUrl: this.optional(value.gitHubUrl),
        portfolioUrl: this.optional(value.portfolioUrl),
        locationCity: this.optional(value.locationCity),
        locationCountry: this.optional(value.locationCountry),
        locationState: this.optional(value.locationState),
        locationPostalCode: this.optional(value.locationPostalCode),
        isOpenToWork: Boolean(value.isOpenToWork),
      }));
      await this.load();
      this.editing.set(false);
      this.saved.set(true);
    } catch {
      this.error.set('profile.error.save');
    } finally {
      this.saving.set(false);
    }
  }

  skillLevel(level: number): string {
    return ['','Beginner', 'Intermediate', 'Advanced', 'Expert'][level] ?? '';
  }

  private patchForm(profile: ApplicantProfile): void {
    this.form.reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      headline: profile.headline ?? '',
      summary: profile.summary ?? '',
      phone: profile.phone ?? '',
      avatarUrl: profile.avatarUrl ?? '',
      linkedInUrl: profile.linkedInUrl ?? '',
      gitHubUrl: profile.gitHubUrl ?? '',
      portfolioUrl: profile.portfolioUrl ?? '',
      locationCity: profile.location?.city ?? '',
      locationCountry: profile.location?.country ?? '',
      locationState: profile.location?.state ?? '',
      locationPostalCode: profile.location?.postalCode ?? '',
      isOpenToWork: profile.isOpenToWork,
    });
  }

  private optional(value: string | null | undefined): string | undefined {
    return value?.trim() || undefined;
  }
}
