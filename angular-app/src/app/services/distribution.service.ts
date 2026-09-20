import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
export enum DistributionChannel { Website = 1, Telegram = 2, LinkedIn = 3, Facebook = 4, X = 5 }
export interface Distribution { id: string; channel: DistributionChannel; status: number; content: string; }
@Injectable({ providedIn: 'root' }) export class DistributionService { private readonly http = inject(HttpClient); get(jobId: string) { return this.http.get<Distribution[]>(`${environment.apiUrl}/jobdistributions/job/${jobId}`); } prepare(jobId: string, channels: DistributionChannel[]) { return this.http.post<void>(`${environment.apiUrl}/jobdistributions/job/${jobId}/prepare`, { channels }); } approve(id: string, content: string) { return this.http.put<void>(`${environment.apiUrl}/jobdistributions/${id}/approve`, { content }); } }
