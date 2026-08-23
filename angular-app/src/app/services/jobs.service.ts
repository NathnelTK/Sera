import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Job {
  id: string;
  title: string;
  description: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: string;
  status: string;
  deadline?: string;
  createdAt: string;
  recruiterName: string;
  companyName?: string;
}

export interface PagedResponse {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  constructor(private http: HttpClient) {}

  getJobs(page: number = 1, pageSize: number = 10, search?: string): Observable<PagedResponse> {
    let url = `${environment.apiUrl}/jobs?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<PagedResponse>(url);
  }

  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${environment.apiUrl}/jobs/${id}`);
  }

  createJob(job: Partial<Job>): Observable<any> {
    return this.http.post(`${environment.apiUrl}/jobs`, job);
  }

  updateJob(id: string, job: Partial<Job>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/jobs/${id}`, job);
  }

  deleteJob(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/jobs/${id}`);
  }

  getPublishedJobs(): Observable<PagedResponse> {
    return this.http.get<PagedResponse>(`${environment.apiUrl}/jobs?status=Published`);
  }
}