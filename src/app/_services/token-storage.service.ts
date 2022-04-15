import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  
  constructor(private authService: AuthService) { 
    console.log('tss constructor');
    const token = this.getToken();
    if(token !== null) {
      console.log('!== null');
      this.authService.getUserInfo(token).subscribe({
        next: (user: User) => {
          this.userInfos = user;
          console.log('from tokenStorageService constructor');
          console.log(this.userInfos);
          
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }  
  }

  private userInfos!: User;  
  TOKEN_KEY = 'auth-token';

  private loginConfirmedSource = new Subject<boolean>();

  loginConfirmed$ = this.loginConfirmedSource.asObservable();

  public confirmLogin() {
    this.loginConfirmedSource.next(true);
  }

  public signOut(): void {
    window.sessionStorage.clear();
  }

  

  public getToken(): string | null {
    return window.sessionStorage.getItem(this.TOKEN_KEY);
  }

  public saveUser(user: User): void {
    this.userInfos = user;
  }

  public getUser(): User {
    return this.userInfos;
  }
}