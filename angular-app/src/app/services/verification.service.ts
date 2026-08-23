import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Payload for `POST /api/verification/fayda`. Field names/limits mirror the backend
 * `SubmitFaydaVerificationRequest` DTO. `signatureVerified` drives server behaviour:
 * `true` auto-approves, otherwise the submission is queued for manual review.
 */
export interface SubmitFaydaVerificationRequest {
  fan: string;
  fullName: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  signatureVerified: boolean;
  rawPayloadJson?: string | null;
}

/** Verification lifecycle. The API serialises these enums as integers. */
export enum VerificationStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

/** Shape returned by `GET /api/verification/{id}` (enums arrive as numbers). */
export interface VerificationResponse {
  id: string;
  userId: string;
  companyId?: string | null;
  verificationType: number;
  status: number;
  notes?: string | null;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  submittedAt: string;
  referenceNumber?: string | null;
  signatureVerified: boolean;
}

@Injectable({ providedIn: 'root' })
export class VerificationService {
  constructor(private http: HttpClient) {}

  /** Submit decoded Fayda fields. The Bearer token is attached by the auth interceptor. */
  submitFayda(req: SubmitFaydaVerificationRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${environment.apiUrl}/verification/fayda`, req);
  }

  getVerification(id: string): Observable<VerificationResponse> {
    return this.http.get<VerificationResponse>(`${environment.apiUrl}/verification/${id}`);
  }
}
