import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobType, WorkMode } from '../core/workflow/workflow';

export interface SavedJob { id: string; jobId: string; title: string; companyName?: string; jobType: JobType; workMode: WorkMode; savedAt: string; }

@Injectable({ providedIn: 'root' })
export class SavedJobsService {
  private readonly http = inject(HttpClient);
  getMine(): Observable<SavedJob[]> { return this.http.get<SavedJob[]>(`${environment.apiUrl}/savedjobs`); }
  save(jobId: string): Observable<void> { return this.http.post<void>(`${environment.apiUrl}/savedjobs/${jobId}`, {}); }
  remove(jobId: string): Observable<void> { return this.http.delete<void>(`${environment.apiUrl}/savedjobs/${jobId}`); }
}
