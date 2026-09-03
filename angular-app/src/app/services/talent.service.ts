import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TalentSkill { name: string; level: number; yearsOfExperience?: number; }
export interface TalentExperience {
  companyName: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrentPosition: boolean;
}
export interface TalentProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  avatarUrl?: string;
  isOpenToWork: boolean;
  location?: { city: string; country: string; state?: string; postalCode?: string };
  skills: TalentSkill[];
  experiences: TalentExperience[];
}
export interface TalentSearchResponse {
  items: TalentProfile[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Injectable({ providedIn: 'root' })
export class TalentService {
  private readonly http = inject(HttpClient);

  search(page = 1, pageSize = 12, search?: string, location?: string, skill?: string, openToWorkOnly = true): Observable<TalentSearchResponse> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize).set('openToWorkOnly', openToWorkOnly);
    for (const [key, value] of Object.entries({ search, location, skill })) {
      if (value?.trim()) params = params.set(key, value.trim());
    }
    return this.http.get<TalentSearchResponse>(`${environment.apiUrl}/applicants/discover`, { params });
  }

  getById(id: string): Observable<TalentProfile> {
    return this.http.get<TalentProfile>(`${environment.apiUrl}/applicants/discover/${id}`);
  }
}
