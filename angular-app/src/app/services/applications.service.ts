import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApplicationStatus } from '../core/workflow/workflow';
import { ApplicationMode } from './application-mode';

/** Mirrors ApplicationSummaryResponse. */
export interface ApplicationSummary {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName?: string;
  status: ApplicationStatus;
  appliedAt: string;
}

/** Mirrors ApplicationDetailsResponse. */
export interface ApplicationDetails {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName?: string;
  applicantProfileId: string;
  applicantName: string;
  status: ApplicationStatus;
  coverLetter?: string;
  matchScore?: number;
  aiSummary?: string;
  rejectionReason?: string;
  reviewedAt?: string;
  appliedAt: string;
}

/** Mirrors ApplyForJobCommand. */
export interface ApplyForJobRequest {
  jobId: string;
  coverLetter?: string;
  cvId?: string;
  mode?: ApplicationMode;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private http = inject(HttpClient);

  /** POST /api/applications — Applicant. Returns the new application id. */
  apply(req: ApplyForJobRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${environment.apiUrl}/applications`, req);
  }

  /** GET /api/applications/{id}. */
  getById(id: string): Observable<ApplicationDetails> {
    return this.http.get<ApplicationDetails>(`${environment.apiUrl}/applications/${id}`);
  }

  /** GET /api/applications/my — Applicant. Bare array. */
  getMy(): Observable<ApplicationSummary[]> {
    return this.http.get<ApplicationSummary[]>(`${environment.apiUrl}/applications/my`);
  }

  /** PUT /api/applications/{id}/status — Recruiter. 204 No Content. */
  updateStatus(id: string, status: ApplicationStatus, rejectionReason?: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/applications/${id}/status`, { status, rejectionReason });
  }

  /** DELETE /api/applications/{id} — Applicant withdraws. 204 No Content. */
  withdraw(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/applications/${id}`);
  }
}
