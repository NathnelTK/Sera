import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { SavedJob, SavedJobsService } from '../../../services/saved-jobs.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { jobTypeKey, workModeKey } from '../../../core/workflow/workflow';

@Component({ selector: 'app-saved-jobs', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe], templateUrl: './saved-jobs.component.html', styleUrl: './saved-jobs.component.scss' })
export class SavedJobsComponent {
  private readonly service = inject(SavedJobsService);
  readonly jobs = signal<SavedJob[]>([]); readonly loading = signal(true); readonly error = signal(false); readonly removing = signal<string | null>(null);
  readonly jobTypeKey = jobTypeKey; readonly workModeKey = workModeKey;
  constructor() { void this.load(); }
  async load() { this.loading.set(true); this.error.set(false); try { this.jobs.set(await firstValueFrom(this.service.getMine())); } catch { this.error.set(true); } finally { this.loading.set(false); } }
  async remove(job: SavedJob) { this.removing.set(job.jobId); try { await firstValueFrom(this.service.remove(job.jobId)); this.jobs.update(jobs => jobs.filter(x => x.jobId !== job.jobId)); } finally { this.removing.set(null); } }
}
