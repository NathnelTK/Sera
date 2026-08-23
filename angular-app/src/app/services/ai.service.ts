import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResumeAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
}

export interface CandidateMatching {
  matchScore: number;
  insights: string[];
  gaps: string[];
  recommendation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor(private http: HttpClient) {}

  analyzeResume(resumeText: string): Observable<ResumeAnalysis> {
    return this.http.post<ResumeAnalysis>(`${environment.apiUrl}/ai/resume-analyzer`, { resumeText });
  }

  matchCandidate(candidateProfile: any, jobDescription: string): Observable<CandidateMatching> {
    return this.http.post<CandidateMatching>(`${environment.apiUrl}/ai/candidate-matching`, {
      candidateProfile,
      jobDescription
    });
  }
}