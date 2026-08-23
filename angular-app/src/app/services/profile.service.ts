import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApplicantProfile {
  id: string;
  user_id: string;
  name: string;
  headline?: string;
  summary?: string;
  open_to_work: boolean;
  links: Array<{ type: string; url: string }>;
  created_at: string;
  updated_at: string;
  email?: string;
  skills?: Array<{ name: string; proficiency: string }>;
}

export interface RecruiterProfile {
  id: string;
  user_id: string;
  name: string;
  company: string;
  position?: string;
  contact_info: Record<string, any>;
  created_at: string;
  updated_at: string;
  email?: string;
}

export type Profile = ApplicantProfile | RecruiterProfile;

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/profile`);
  }

  updateProfile(profile: Partial<Profile>): Observable<Profile> {
    return this.http.put<Profile>(`${environment.apiUrl}/profile`, profile);
  }
}