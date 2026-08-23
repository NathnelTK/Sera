import { Injectable, signal, computed, inject } from '@angular/core';
import { DocumentsService, Document, DocumentsResponse } from '../services/documents.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsStore {
  private documentsService = inject(DocumentsService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  documents = signal<Document[]>([]);
  currentDocument = signal<Document | null>(null);
  
  // Computed
  hasDocuments = computed(() => this.documents().length > 0);
  cvDocuments = computed(() => this.documents().filter(doc => doc.document_type === 'CV'));
  certificateDocuments = computed(() => this.documents().filter(doc => doc.document_type === 'Certificate'));
  otherDocuments = computed(() => this.documents().filter(doc => doc.document_type === 'Other'));
  
  async loadDocuments() {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const response = await this.documentsService.getDocuments().toPromise();
      if (response) {
        this.documents.set(response.items);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load documents');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async uploadDocument(file: File, documentType: 'CV' | 'Certificate' | 'Other') {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const uploadedDocument = await this.documentsService.uploadDocument(file, documentType).toPromise();
      if (uploadedDocument) {
        this.documents.update(docs => [...docs, uploadedDocument]);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to upload document');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async deleteDocument(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.documentsService.deleteDocument(id).toPromise();
      this.documents.update(docs => docs.filter(doc => doc.id !== id));
      if (this.currentDocument()?.id === id) {
        this.currentDocument.set(null);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to delete document');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  clearCurrentDocument() {
    this.currentDocument.set(null);
  }
}