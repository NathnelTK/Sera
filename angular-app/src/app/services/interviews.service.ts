import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Interview {
  id: string;
  application_id: string;
  job_id: string;
  applicant_id: string;
  recruiter_id: string;
  scheduled_date: string;
  duration: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
  created_at: string;
  updated_at: string;
  job_title?: string;
  job_company?: string;
  applicant_name?: string;
  applicant_email?: string;
  recruiter_name?: string;
  recruiter_company?: string;
}

export interface InterviewsResponse {
  items: Interview[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewsService {
  constructor(private http: HttpClient) {}

  getInterviews(applicantId?: string, recruiterId?: string): Observable<InterviewsResponse> {
    let url = `${environment.apiUrl}/interviews`;
    const params: string[] = [];
    
    if (applicantId) params.push(`applicantId=${applicantId}`);
    if (recruiterId) params.push(`recruiterId=${recruiterId}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<InterviewsResponse>(url);
  }

  scheduleInterview(interview: Partial<Interview>): Observable<Interview> {
    return this.http.post<Interview>(`${environment.apiUrl}/interviews`, interview);
  }

  updateInterview(id: string, interview: Partial<Interview>): Observable<Interview> {
    return this.http.put<Interview>(`${environment.apiUrl}/interviews/${id}`, interview);
  }

  cancelInterview(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/interviews/${id}`);
  }

  getMyInterviews(): Observable<InterviewsResponse> {
    return this.http.get<InterviewsResponse>(`${environment.apiUrl}/interviews`);
  }
}