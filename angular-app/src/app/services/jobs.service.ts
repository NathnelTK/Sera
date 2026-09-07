import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApplicationStatus, ExperienceLevel, JobStatus, JobType, WorkMode } from '../core/workflow/workflow';

/** Mirrors JobSummaryResponse. */
export interface JobSummary {
  id: string;
  title: string;
  description: string;
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: string;
  status: JobStatus;
  deadline?: string;
  createdAt: string;
  recruiterName: string;
  companyName?: string;
  categoryName?: string;
  locationCity?: string;
  locationCountry?: string;
}

export interface JobSearchFilters {
  search?: string;
  category?: string;
  location?: string;
  jobType?: JobType;
  workMode?: WorkMode;
  sortBy?: string;
}

/** Mirrors JobDetailsResponse. */
export interface JobDetails extends JobSummary {
  requirements?: string;
  benefits?: string;
  publishedAt?: string;
  recruiterProfileId: string;
  companyId?: string;
  applicationCount: number;
}

/** Back-compat alias used by the public jobs list and store. */
export type Job = JobSummary;

/** Body for CreateJobCommand / UpdateJobCommand (jobId is carried in the URL + body on update). */
export interface JobFormPayload {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: string;
  deadline?: string;
}

/** Mirrors PagedList<T>. */
export interface PagedResponse<T = JobSummary> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/** Mirrors JobApplicationSummary (candidate row on the recruiter pipeline). */
export interface JobApplicationSummary {
  applicationId: string;
  applicantProfileId: string;
  applicantName: string;
  status: ApplicationStatus;
  appliedAt: string;
  matchScore?: number;
  matchExplanation?: string;
  skillsMatch?: number;
  experienceMatch?: number;
  educationMatch?: number;
  requirementsMatch?: number;
  locationMatch?: number;
}

@Injectable({ providedIn: 'root' })
export class JobsService {
  private http = inject(HttpClient);

  /** GET /api/jobs — published jobs, paged. */
  getJobs(page = 1, pageSize = 10, filters: JobSearchFilters = {}): Observable<PagedResponse> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<PagedResponse>(`${environment.apiUrl}/jobs`, { params });
  }

  /** GET /api/jobs/{id}. */
  getJobById(id: string): Observable<JobDetails> {
    return this.http.get<JobDetails>(`${environment.apiUrl}/jobs/${id}`);
  }

  /** GET /api/jobs/mine — Recruiter. Bare array. */
  getMyJobs(): Observable<JobSummary[]> {
    return this.http.get<JobSummary[]>(`${environment.apiUrl}/jobs/mine`);
  }

  /** GET /api/jobs/{id}/applications — Recruiter. Bare array of candidates. */
  getJobApplications(jobId: string): Observable<JobApplicationSummary[]> {
    return this.http.get<JobApplicationSummary[]>(`${environment.apiUrl}/jobs/${jobId}/applications`);
  }

  /** POST /api/jobs — Recruiter. Returns the new (draft) job id. */
  createJob(job: JobFormPayload): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${environment.apiUrl}/jobs`, job);
  }

  /** PUT /api/jobs/{id} — Recruiter. 204 No Content. */
  updateJob(id: string, job: JobFormPayload): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/jobs/${id}`, { jobId: id, ...job });
  }

  /** POST /api/jobs/{id}/publish — Recruiter. 204 No Content. */
  publishJob(id: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/jobs/${id}/publish`, {});
  }

  /** POST /api/jobs/{id}/close — Recruiter. 204 No Content. */
  closeJob(id: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/jobs/${id}/close`, {});
  }

  /** DELETE /api/jobs/{id} — Recruiter. 204 No Content. */
  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/jobs/${id}`);
  }
}
