import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  ApplicationsService,
  ApplicationSummary,
  ApplicationDetails,
  ApplyForJobRequest,
} from '../services/applications.service';
import { TranslationService } from '../core/i18n/translation.service';
import { ApplicationStatus } from '../core/workflow/workflow';

@Injectable({ providedIn: 'root' })
export class ApplicationsStore {
  private service = inject(ApplicationsService);
  private i18n = inject(TranslationService);

  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  applications = signal<ApplicationSummary[]>([]);
  currentApplication = signal<ApplicationDetails | null>(null);

  // Computed
  hasApplications = computed(() => this.applications().length > 0);

  /** In-progress = submitted / under review / shortlisted (non-terminal, pre-decision). */
  pendingApplications = computed(() =>
    this.applications().filter(
      (a) =>
        a.status === ApplicationStatus.Submitted ||
        a.status === ApplicationStatus.UnderReview ||
        a.status === ApplicationStatus.Shortlisted,
    ),
  );
  acceptedApplications = computed(() =>
    this.applications().filter((a) => a.status === ApplicationStatus.Accepted),
  );
  rejectedApplications = computed(() =>
    this.applications().filter((a) => a.status === ApplicationStatus.Rejected),
  );

  async loadMyApplications(): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const list = await firstValueFrom(this.service.getMy());
      this.applications.set(Array.isArray(list) ? list : []);
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.loadApplications'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadApplicationById(id: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const details = await firstValueFrom(this.service.getById(id));
      this.currentApplication.set(details ?? null);
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.loadApplication'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Apply for a job. Returns the new application id, or null on failure. */
  async apply(req: ApplyForJobRequest): Promise<string | null> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const created = await firstValueFrom(this.service.apply(req));
      return created?.id ?? null;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.apply'));
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Recruiter moves a candidate to a new status. */
  async updateStatus(
    id: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.service.updateStatus(id, status, rejectionReason));
      this.patchLocal(id, { status, rejectionReason });
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.updateStatus'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Applicant withdraws their own application. */
  async withdraw(id: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.service.withdraw(id));
      this.patchLocal(id, { status: ApplicationStatus.Withdrawn });
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.withdraw'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  clearCurrentApplication(): void {
    this.currentApplication.set(null);
  }

  private patchLocal(id: string, patch: Partial<ApplicationDetails & ApplicationSummary>): void {
    this.applications.update((apps) =>
      apps.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
    const current = this.currentApplication();
    if (current?.id === id) {
      this.currentApplication.set({ ...current, ...patch });
    }
  }

  /** Pull a human message out of a plain `{ error }` body or an RFC 7807 problem. */
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
