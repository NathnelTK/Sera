import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { JobsService, Job, PagedResponse } from '../services/jobs.service';

@Injectable({
  providedIn: 'root'
})
export class JobsStore {
  private jobsService = inject(JobsService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  jobs = signal<Job[]>([]);
  currentJob = signal<Job | null>(null);
  pagination = signal({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  
  // Computed
  hasJobs = computed(() => this.jobs().length > 0);
  publishedJobs = computed(() => this.jobs().filter(job => job.status === 'Published'));
  
  constructor() {
    // Initialize with published jobs
    this.loadPublishedJobs();
  }
  
  async loadJobs(page: number = 1, pageSize: number = 10, search?: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const response = await this.jobsService.getJobs(page, pageSize, search).toPromise();
      if (response) {
        this.jobs.set(response.items);
        this.pagination.set({
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages
        });
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load jobs');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async loadPublishedJobs() {
    return this.loadJobs(1, 50);
  }
  
  async loadJobById(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const job = await this.jobsService.getJobById(id).toPromise();
      if (job) {
        this.currentJob.set(job);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load job');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async createJob(job: Partial<Job>) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const createdJob = await this.jobsService.createJob(job).toPromise();
      if (createdJob) {
        this.jobs.update(jobs => [...jobs, createdJob]);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to create job');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async updateJob(id: string, job: Partial<Job>) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const updatedJob = await this.jobsService.updateJob(id, job).toPromise();
      if (updatedJob) {
        this.jobs.update(jobs => jobs.map(j => j.id === id ? { ...j, ...updatedJob } : j));
        if (this.currentJob()?.id === id) {
          this.currentJob.set({ ...this.currentJob()!, ...updatedJob });
        }
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to update job');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async deleteJob(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.jobsService.deleteJob(id).toPromise();
      this.jobs.update(jobs => jobs.filter(j => j.id !== id));
      if (this.currentJob()?.id === id) {
        this.currentJob.set(null);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to delete job');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  clearCurrentJob() {
    this.currentJob.set(null);
  }
}