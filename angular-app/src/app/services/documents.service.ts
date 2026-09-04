import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export enum DocumentType { Resume = 1, CoverLetter = 2, Portfolio = 3, Certificate = 4, NationalId = 5, Other = 99 }
export interface DocumentRecord {
  id: string; uploadedByUserId: string; documentType: DocumentType; fileName: string; fileUrl: string;
  fileSizeBytes: number; mimeType?: string; description?: string; uploadedAt: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly http = inject(HttpClient);
  getMine(): Observable<DocumentRecord[]> { return this.http.get<DocumentRecord[]>(`${environment.apiUrl}/documents/mine`); }
  upload(file: File, documentType: DocumentType, description?: string): Observable<{ id: string }> {
    const form = new FormData(); form.append('file', file); form.append('documentType', String(documentType));
    if (description?.trim()) form.append('description', description.trim());
    return this.http.post<{ id: string }>(`${environment.apiUrl}/documents`, form);
  }
  remove(id: string): Observable<void> { return this.http.delete<void>(`${environment.apiUrl}/documents/${id}`); }
}
