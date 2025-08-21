import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { UserProfile } from './models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private SupabaseClient = inject(SupabaseService).supabase;

  session() {
    return this.SupabaseClient.auth.getSession();
  }

  signup(credentials: SignUpWithPasswordCredentials, userData: UserProfile) {
    return this.SupabaseClient.auth.signUp({
      ...credentials,
      options: {
        data: {
          ...userData
        }
      }
    });
  }

  signin(credentials: SignInWithPasswordCredentials) {
    return this.SupabaseClient.auth.signInWithPassword(credentials);
  }

  signout() {
    return this.SupabaseClient.auth.signOut();
  }
}

