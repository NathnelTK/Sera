import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

interface RecruiterProfile { id: string; email: string; firstName: string; lastName: string; title?: string; bio?: string; avatarUrl?: string; phone?: string; recruiterType: number; verificationStatus?: number | string; }

@Component({ selector: 'app-profile', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './profile.component.html', styleUrl: './profile.component.scss' })
export class ProfileComponent {
  private readonly http = inject(HttpClient); private readonly fb = inject(FormBuilder);
  readonly loading = signal(true); readonly saving = signal(false); readonly error = signal<string | null>(null); readonly saved = signal(false); readonly profile = signal<RecruiterProfile | null>(null);
  readonly form = this.fb.nonNullable.group({ firstName: ['', Validators.required], lastName: ['', Validators.required], title: [''], bio: [''], phone: [''], avatarUrl: [''], recruiterType: [1, Validators.required] });
  readonly types = [{ value: 1, label: 'Individual' }, { value: 2, label: 'Company' }, { value: 3, label: 'Agency' }, { value: 4, label: 'Organization' }];
  constructor() { void this.load(); }
  verificationLabel(status: number | string | undefined): string { const value = String(status ?? '').toLowerCase(); return value === '2' || value === 'approved' ? 'Verified' : value === '3' || value === 'rejected' ? 'Rejected' : 'Pending verification'; }
  verificationClass(status: number | string | undefined): string { const value = String(status ?? '').toLowerCase(); return value === '2' || value === 'approved' ? 'status-2' : value === '3' || value === 'rejected' ? 'status-3' : 'status-1'; }
  async load(): Promise<void> { this.loading.set(true); try { const p = await firstValueFrom(this.http.get<RecruiterProfile>(`${environment.apiUrl}/recruiters/me`)); this.profile.set(p); this.form.patchValue(p); } catch { this.error.set('We could not load your profile.'); } finally { this.loading.set(false); } }
  async save(): Promise<void> { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving.set(true); this.error.set(null); this.saved.set(false); try { await firstValueFrom(this.http.put(`${environment.apiUrl}/recruiters/${this.profile()?.id ?? 'me'}`, this.form.getRawValue())); this.saved.set(true); await this.load(); } catch { this.error.set('We could not save your profile. Please try again.'); } finally { this.saving.set(false); } }
}
