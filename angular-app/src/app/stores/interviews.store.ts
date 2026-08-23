import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  InterviewsService,
  Interview,
  ScheduleInterviewRequest,
} from '../services/interviews.service';
import { TranslationService } from '../core/i18n/translation.service';
import { InterviewStatus } from '../core/workflow/workflow';

@Injectable({ providedIn: 'root' })
export class InterviewsStore {
  private service = inject(InterviewsService);
  private i18n = inject(TranslationService);

  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  interviews = signal<Interview[]>([]);
  currentInterview = signal<Interview | null>(null);

  // Computed
  hasInterviews = computed(() => this.interviews().length > 0);

  private isActive(i: Interview): boolean {
    return i.status === InterviewStatus.Scheduled || i.status === InterviewStatus.Rescheduled;
  }

  scheduledInterviews = computed(() => this.interviews().filter((i) => this.isActive(i)));
  completedInterviews = computed(() =>
    this.interviews().filter((i) => i.status === InterviewStatus.Completed),
  );
  upcomingInterviews = computed(() => {
    const now = Date.now();
    return this.interviews()
      .filter((i) => this.isActive(i) && new Date(i.scheduledAt).getTime() > now)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  });

  async loadMyInterviews(): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const list = await firstValueFrom(this.service.getMy());
      this.interviews.set(list ?? []);
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.loadInterviews'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Recruiter schedules an interview. Returns the new interview id, or null on failure. */
  async scheduleInterview(req: ScheduleInterviewRequest): Promise<string | null> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const created = await firstValueFrom(this.service.schedule(req));
      await this.loadMyInterviews();
      return created?.id ?? null;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.scheduleInterview'));
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async cancelInterview(id: string, reason?: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.service.cancel(id, reason));
      this.interviews.update((ints) =>
        ints.map((i) =>
          i.id === id ? { ...i, status: InterviewStatus.Cancelled, cancellationReason: reason } : i,
        ),
      );
      return true;
    } catch (err) {
      this.error.set(this.messageFrom(err, 'wf.error.cancelInterview'));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  clearCurrentInterview(): void {
    this.currentInterview.set(null);
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
