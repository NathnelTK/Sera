import { Injectable, signal, computed, inject } from '@angular/core';
import { ApplicationsService, Application, ApplicationsResponse } from '../services/applications.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsStore {
  private applicationsService = inject(ApplicationsService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  applications = signal<Application[]>([]);
  currentApplication = signal<Application | null>(null);
  
  // Computed
  hasApplications = computed(() => this.applications().length > 0);
  pendingApplications = computed(() => this.applications().filter(app => app.status === 'Pending'));
  acceptedApplications = computed(() => this.applications().filter(app => app.status === 'Accepted'));
  rejectedApplications = computed(() => this.applications().filter(app => app.status === 'Rejected'));
  
  async loadApplications(applicantId?: string, jobId?: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const response = await this.applicationsService.getApplications(applicantId, jobId).toPromise();
      if (response) {
        this.applications.set(response.items);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load applications');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async loadMyApplications() {
    return this.loadApplications();
  }
  
  async loadApplicationById(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const application = await this.applicationsService.getApplicationById(id).toPromise();
      if (application) {
        this.currentApplication.set(application);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load application');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async createApplication(application: Partial<Application>) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const createdApplication = await this.applicationsService.createApplication(application).toPromise();
      if (createdApplication) {
        this.applications.update(apps => [...apps, createdApplication]);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to create application');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async updateApplicationStatus(id: string, status: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const updatedApplication = await this.applicationsService.updateApplicationStatus(id, status).toPromise();
      if (updatedApplication) {
        this.applications.update(apps => apps.map(app => app.id === id ? { ...app, ...updatedApplication } : app));
        if (this.currentApplication()?.id === id) {
          this.currentApplication.set({ ...this.currentApplication()!, ...updatedApplication });
        }
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to update application');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async withdrawApplication(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.applicationsService.withdrawApplication(id).toPromise();
      this.applications.update(apps => apps.filter(app => app.id !== id));
      if (this.currentApplication()?.id === id) {
        this.currentApplication.set(null);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to withdraw application');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  clearCurrentApplication() {
    this.currentApplication.set(null);
  }
}