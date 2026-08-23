import { Injectable, signal, computed, inject } from '@angular/core';
import { AiService, ResumeAnalysis, CandidateMatching } from '../services/ai.service';

@Injectable({
  providedIn: 'root'
})
export class AiStore {
  private aiService = inject(AiService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  resumeAnalysis = signal<ResumeAnalysis | null>(null);
  candidateMatching = signal<CandidateMatching | null>(null);
  
  // Computed
  hasResumeAnalysis = computed(() => this.resumeAnalysis() !== null);
  hasCandidateMatching = computed(() => this.candidateMatching() !== null);
  
  async analyzeResume(resumeText: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const analysis = await this.aiService.analyzeResume(resumeText).toPromise();
      if (analysis) {
        this.resumeAnalysis.set(analysis);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to analyze resume');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async matchCandidate(candidateProfile: any, jobDescription: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const matching = await this.aiService.matchCandidate(candidateProfile, jobDescription).toPromise();
      if (matching) {
        this.candidateMatching.set(matching);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to match candidate');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  clearResumeAnalysis() {
    this.resumeAnalysis.set(null);
  }
  
  clearCandidateMatching() {
    this.candidateMatching.set(null);
  }
}