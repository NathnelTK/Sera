import { Injectable, signal, computed, inject } from '@angular/core';
import { ProfileService, ApplicantProfile } from '../services/profile.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileStore {
  private profileService = inject(ProfileService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  profile = signal<ApplicantProfile | null>(null);
  
  // Computed
  hasProfile = computed(() => this.profile() !== null);
  isApplicantProfile = computed(() => {
    const prof = this.profile();
    return prof !== null;
  });
  isRecruiterProfile = computed(() => {
    return false;
  });
  
  async loadProfile() {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const profile = await firstValueFrom(this.profileService.getMyApplicantProfile());
      if (profile) {
        this.profile.set(profile);
      }
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load profile');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async updateProfile(profileData: Partial<ApplicantProfile>) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const current = this.profile();
      if (!current) return false;
      await firstValueFrom(this.profileService.updateMyApplicantProfile({ ...current, ...profileData }));
      await this.loadProfile();
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to update profile');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  clearProfile() {
    this.profile.set(null);
  }
}
