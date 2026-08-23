import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InterviewFormat, InterviewStatus } from '../core/workflow/workflow';

/** Mirrors InterviewResponse. */
export interface Interview {
  id: string;
  jobApplicationId: string;
  status: InterviewStatus;
  format: InterviewFormat;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  locationDescription?: string;
  notes?: string;
  cancellationReason?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
}

/** Mirrors ScheduleInterviewRequest. */
export interface ScheduleInterviewRequest {
  jobApplicationId: string;
  format: InterviewFormat;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  locationDescription?: string;
  notes?: string;
}

/** Mirrors UpdateInterviewRequest. */
export interface UpdateInterviewRequest {
  format: InterviewFormat;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  locationDescription?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class InterviewsService {
  private http = inject(HttpClient);

  /** POST /api/interviews — Recruiter. Returns the new interview id. */
  schedule(req: ScheduleInterviewRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${environment.apiUrl}/interviews`, req);
  }

  /** GET /api/interviews/{id}. */
  getById(id: string): Observable<Interview> {
    return this.http.get<Interview>(`${environment.apiUrl}/interviews/${id}`);
  }

  /** GET /api/interviews/my — recruiter or applicant. Bare array. */
  getMy(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${environment.apiUrl}/interviews/my`);
  }

  /** PUT /api/interviews/{id} — Recruiter. 204 No Content. */
  update(id: string, req: UpdateInterviewRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/interviews/${id}`, req);
  }

  /** DELETE /api/interviews/{id}?reason= — Recruiter. 204 No Content. */
  cancel(id: string, reason?: string): Observable<void> {
    const q = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return this.http.delete<void>(`${environment.apiUrl}/interviews/${id}${q}`);
  }
}
