import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import {
  JobsService,
  JobSummary,
  JobDetails,
  JobFormPayload,
} from '../services/jobs.service';
import { TranslationService } from '../core/i18n/translation.service';
import { JobStatus } from '../core/workflow/workflow';

@Injectable({ providedIn: 'root' })
export class JobsStore {
  private service = inject(JobsService);
  private i18n = inject(TranslationService);

  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  jobs = signal<JobSummary[]>([]);
  myJobs = signal<JobSummary[]>([]);
  currentJob = signal<JobDetails | null>(null);
  pagination = signal({ currentPage: 1, pageSize: 10, totalCount: 0, totalPages: 0 });

  // Computed
  hasJobs = computed(() => this.jobs().length > 0);
  publishedJobs = computed(() => this.jobs().filter((j) => j.status === JobStatus.Published));

  async loadJobs(page = 1, pageSize = 10, search?: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const res = await firstValueFrom(this.service.getJobs(page, pageSize, search));
      if (res) {
        this.jobs.set(res.items ?? []);
        this.pagination.set({
          currentPage: res.currentPage,
          pageSize: res.pageSize,
          totalCount: res.totalCount,
          totalPages: res.totalPages,
        });
      }
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.loadJobs'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadPublishedJobs(): Promise<boolean> {
    return this.loadJobs(1, 50);
  }

  async loadJobById(id: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const job = await firstValueFrom(this.service.getJobById(id));
      this.currentJob.set(job ?? null);
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.loadJob'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMyJobs(): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const list = await firstValueFrom(this.service.getMyJobs());
      this.myJobs.set(list ?? []);
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.loadJobs'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Create a draft job. Returns the new job id, or null on failure. */
  async createJob(job: JobFormPayload): Promise<string | null> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const created = await firstValueFrom(this.service.createJob(job));
      return created?.id ?? null;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.saveJob'));
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateJob(id: string, job: JobFormPayload): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.service.updateJob(id, job));
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.saveJob'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async publishJob(id: string): Promise<boolean> {
    return this.mutateStatus(id, () => this.service.publishJob(id), JobStatus.Published);
  }

  async closeJob(id: string): Promise<boolean> {
    return this.mutateStatus(id, () => this.service.closeJob(id), JobStatus.Closed);
  }

  async deleteJob(id: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.service.deleteJob(id));
      this.myJobs.update((jobs) => jobs.filter((j) => j.id !== id));
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.saveJob'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  clearCurrentJob(): void {
    this.currentJob.set(null);
  }

  private async mutateStatus(
    id: string,
    action: () => Observable<void>,
    newStatus: JobStatus,
  ): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(action());
      this.myJobs.update((jobs) =>
        jobs.map((j) => (j.id === id ? { ...j, status: newStatus } : j)),
      );
      const current = this.currentJob();
      if (current?.id === id) {
        this.currentJob.set({ ...current, status: newStatus });
      }
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.saveJob'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  private messageFrom(err: unknown, fallbackKey: string): string {
    const body = (err as { error?: unknown })?.error;
    if (typeof body === 'string' && body.trim()) return body;
    if (body && typeof body === 'object') {
      const problem = body as { error?: string; title?: string; detail?: string };
      const msg = problem.error ?? problem.detail ?? problem.title;
      if (msg) return msg;
    }
    return this.i18n.instant(fallbackKey);
  }
}
