import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Document {
  id: string;
  applicant_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  document_type: 'CV' | 'Certificate' | 'Other';
  uploaded_at: string;
}

export interface DocumentsResponse {
  items: Document[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  constructor(private http: HttpClient) {}

  getDocuments(): Observable<DocumentsResponse> {
    return this.http.get<DocumentsResponse>(`${environment.apiUrl}/documents`);
  }

  uploadDocument(file: File, documentType: 'CV' | 'Certificate' | 'Other'): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return this.http.post<Document>(`${environment.apiUrl}/documents`, formData);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/documents/${id}`);
  }
}