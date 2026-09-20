import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TalentProfile, TalentService } from '../../../services/talent.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-talent',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './talent.component.html',
  styleUrl: './talent.component.scss',
})
export class TalentComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TalentService);
  private readonly destroyRef = inject(DestroyRef);

  readonly talents = signal<TalentProfile[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly totalCount = signal(0);
  readonly form = this.fb.group({ search: [''], location: [''], skill: [''], openToWorkOnly: [true] });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.form.patchValue({
        search: params.get('search') ?? '', location: params.get('location') ?? '',
        skill: params.get('skill') ?? '', openToWorkOnly: params.get('openToWorkOnly') !== 'false',
      }, { emitEvent: false });
      void this.load();
    });
  }

  async load(): Promise<void> {
    this.loading.set(true); this.error.set(null);
    const value = this.form.getRawValue();
    this.service.search(1, 24, value.search ?? undefined, value.location ?? undefined, value.skill ?? undefined, Boolean(value.openToWorkOnly))
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: response => { this.talents.set(response.items ?? []); this.totalCount.set(response.totalCount); this.loading.set(false); },
        error: () => { this.error.set('talent.error.load'); this.loading.set(false); },
      });
  }

  search(): void {
    const value = this.form.getRawValue();
    const queryParams: Record<string, string> = {};
    if (value.search?.trim()) queryParams['search'] = value.search.trim();
    if (value.location?.trim()) queryParams['location'] = value.location.trim();
    if (value.skill?.trim()) queryParams['skill'] = value.skill.trim();
    if (!value.openToWorkOnly) queryParams['openToWorkOnly'] = 'false';
    void this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl: true });
  }

  clear(): void { this.form.reset({ search: '', location: '', skill: '', openToWorkOnly: true }); this.search(); }
  location(profile: TalentProfile): string { return [profile.location?.city, profile.location?.country].filter(Boolean).join(', '); }
  level(level: number): string { return ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'][level] ?? ''; }
  openProfile(id: string): void { this.router.navigate(['/recruiter/talent', id]); }
}
