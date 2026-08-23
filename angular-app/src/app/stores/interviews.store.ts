import { Injectable, signal, computed, inject } from '@angular/core';
import { InterviewsService, Interview, InterviewsResponse } from '../services/interviews.service';

@Injectable({
  providedIn: 'root'
})
export class InterviewsStore {
  private interviewsService = inject(InterviewsService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  interviews = signal<Interview[]>([]);
  currentInterview = signal<Interview | null>(null);
  
  // Computed
  hasInterviews = computed(() => this.interviews().length > 0);
  scheduledInterviews = computed(() => this.interviews().filter(int => int.status === 'Scheduled'));
  completedInterviews = computed(() => this.interviews().filter(int => int.status === 'Completed'));
  upcomingInterviews = computed(() => {
    const now = new Date();
    return this.interviews()
      .filter(int => int.status === 'Scheduled' && new Date(int.scheduled_date) > now)
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());
  });
  
  async loadInterviews(applicantId?: string, recruiterId?: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const response = await this.interviewsService.getInterviews(applicantId, recruiterId).toPromise();
      if (response) {
        this.interviews.set(response.items);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load interviews');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async loadMyInterviews() {
    return this.loadInterviews();
  }
  
  async scheduleInterview(interview: Partial<Interview>) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const createdInterview = await this.interviewsService.scheduleInterview(interview).toPromise();
      if (createdInterview) {
        this.interviews.update(ints => [...ints, createdInterview]);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to schedule interview');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async updateInterview(id: string, interview: Partial<Interview>) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const updatedInterview = await this.interviewsService.updateInterview(id, interview).toPromise();
      if (updatedInterview) {
        this.interviews.update(ints => ints.map(int => int.id === id ? { ...int, ...updatedInterview } : int));
        if (this.currentInterview()?.id === id) {
          this.currentInterview.set({ ...this.currentInterview()!, ...updatedInterview });
        }
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to update interview');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async cancelInterview(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.interviewsService.cancelInterview(id).toPromise();
      this.interviews.update(ints => ints.filter(int => int.id !== id));
      if (this.currentInterview()?.id === id) {
        this.currentInterview.set(null);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to cancel interview');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  clearCurrentInterview() {
    this.currentInterview.set(null);
  }
}