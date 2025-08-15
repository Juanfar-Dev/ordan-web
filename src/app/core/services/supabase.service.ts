import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '../../../environments/environment'

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  accounts() {
    return this.supabase.from('accounts').select('*')
  }

  getAccountById(accountId: string) {
    return this.supabase.from('accounts').select('*').eq('account_id', accountId).single()
  }

  createAccount(account: any) {
    return this.supabase.from('accounts').insert(account)
  }

  updateAccount(account: any) {
    const update = {
      ...account,
      updated_at: new Date(),
    }
    return this.supabase.from('accounts').upsert(update);
  }

  deleteAccount(accountId: string) {
    return this.supabase.from('accounts').delete().eq('account_id', accountId)
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  // updateProfile(profile: Profile) {
  //   const update = {
  //     ...profile,
  //     updated_at: new Date(),
  //   }

  //   return this.supabase.from('profiles').upsert(update)
  // }

  downLoadImage(path: string) {
    return this.supabase.storage.from('stg_ordan_avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('stg_ordan_avatars').upload(filePath, file)
  }
}
