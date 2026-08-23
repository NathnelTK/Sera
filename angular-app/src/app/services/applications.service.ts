import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Accepted';
  cover_letter?: string;
  submitted_at: string;
  updated_at: string;
  job_title?: string;
  job_company?: string;
  applicant_name?: string;
  applicant_email?: string;
  skills?: Array<{ name: string; proficiency: string }>;
}

export interface ApplicationsResponse {
  items: Application[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  constructor(private http: HttpClient) {}

  getApplications(applicantId?: string, jobId?: string): Observable<ApplicationsResponse> {
    let url = `${environment.apiUrl}/applications`;
    const params: string[] = [];
    
    if (applicantId) params.push(`applicantId=${applicantId}`);
    if (jobId) params.push(`jobId=${jobId}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<ApplicationsResponse>(url);
  }

  getApplicationById(id: string): Observable<Application> {
    return this.http.get<Application>(`${environment.apiUrl}/applications/${id}`);
  }

  createApplication(application: Partial<Application>): Observable<Application> {
    return this.http.post<Application>(`${environment.apiUrl}/applications`, application);
  }

  updateApplicationStatus(id: string, status: string): Observable<Application> {
    return this.http.put<Application>(`${environment.apiUrl}/applications/${id}`, { status });
  }

  withdrawApplication(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/applications/${id}`);
  }

  getMyApplications(): Observable<ApplicationsResponse> {
    return this.http.get<ApplicationsResponse>(`${environment.apiUrl}/applications`);
  }
}