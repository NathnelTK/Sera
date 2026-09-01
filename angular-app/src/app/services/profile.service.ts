import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApplicantSkill {
  skillId: string;
  skillName: string;
  level: number;
  yearsOfExperience?: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  description?: string;
  startYear: number;
  endYear?: number;
  isOngoing: boolean;
}

export interface Experience {
  id: string;
  companyName: string;
  title: string;
  description?: string;
  employmentType?: string;
  locationDescription?: string;
  startDate: string;
  endDate?: string;
  isCurrentPosition: boolean;
}

export interface ApplicantProfile {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  phone?: string;
  avatarUrl?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
  isOpenToWork: boolean;
  location?: { city: string; country: string; state?: string; postalCode?: string };
  skills: ApplicantSkill[];
  educations: Education[];
  experiences: Experience[];
  createdAt: string;
  updatedAt: string;
}

export type ApplicantProfileUpdate = Pick<ApplicantProfile,
  | 'firstName'
  | 'lastName'
  | 'headline'
  | 'summary'
  | 'phone'
  | 'avatarUrl'
  | 'linkedInUrl'
  | 'gitHubUrl'
  | 'portfolioUrl'
  | 'isOpenToWork'> & {
    locationCity?: string;
    locationCountry?: string;
    locationState?: string;
    locationPostalCode?: string;
  };

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  getMyApplicantProfile(): Observable<ApplicantProfile> {
    return this.http.get<ApplicantProfile>(`${environment.apiUrl}/applicants/me`);
  }

  updateMyApplicantProfile(profile: ApplicantProfileUpdate): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/applicants/me`, profile);
  }
}
