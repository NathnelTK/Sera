import { Injectable, signal, computed, inject } from '@angular/core';
import { ProfileService, Profile, ApplicantProfile, RecruiterProfile } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileStore {
  private profileService = inject(ProfileService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  profile = signal<Profile | null>(null);
  
  // Computed
  hasProfile = computed(() => this.profile() !== null);
  isApplicantProfile = computed(() => {
    const prof = this.profile();
    return prof && 'skills' in prof;
  });
  isRecruiterProfile = computed(() => {
    const prof = this.profile();
    return prof && 'company' in prof;
  });
  
  async loadProfile() {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const profile = await this.profileService.getProfile().toPromise();
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
  
  async updateProfile(profileData: Partial<Profile>) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const updatedProfile = await this.profileService.updateProfile(profileData).toPromise();
      if (updatedProfile) {
        this.profile.set(updatedProfile);
      }
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