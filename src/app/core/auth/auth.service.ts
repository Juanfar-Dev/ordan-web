import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { UserProfile } from './models/user-profile';
import { Profile } from '../../features/profile/profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private SupabaseClient = inject(SupabaseService).supabase;

  session() {
    return this.SupabaseClient.auth.getSession();
  }

  getUser(): import('rxjs').Observable<Profile | null> {
    return new Observable<Profile | null>(observer => {
      this.SupabaseClient.auth.getUser()
        .then(({ data }) => {
          observer.next(data?.user ? (data.user.user_metadata as Profile) : null);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  async signup(credentials: SignUpWithPasswordCredentials, userData: UserProfile) {
    return await this.SupabaseClient.auth.signUp({
      ...credentials,
      options: {
        data: {
          ...userData
        }
      }
    });
  }

  async signin(credentials: SignInWithPasswordCredentials) {
    return await this.SupabaseClient.auth.signInWithPassword(credentials);
  }

  async signout() {
    return await this.SupabaseClient.auth.signOut();
  }
}

