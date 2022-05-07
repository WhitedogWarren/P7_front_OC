//angular modules and services
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

//interfaces
import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/authStatus.interface';
import { UserApiResponse } from '../modules/routing/users/usersApiResponse.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    constructor(private http: HttpClient) {
        if(window.localStorage.getItem('auth-token'))  {
            this.getUserInfo(window.localStorage.getItem('auth-token')).subscribe({
                next: data => {
                    this.authStatusSource.next({isLogged: true, user: data});
                }})
        }
    }

    AUTH_API = 'http://localhost:3000/api/auth';
    
    public authStatusSource = new BehaviorSubject<AuthStatus>({isLogged: false, user: null});
    authStatus$ = this.authStatusSource.asObservable();

    login(loginEmail: string, loginPassword: string): Observable<UserApiResponse> {
        return this.http.post<UserApiResponse>(this.AUTH_API + '/login', {
            loginEmail,
            loginPassword
        });
    }
    
    public signOut(): void {
        window.localStorage.clear();
        this.authStatusSource.next({isLogged: false, user: null});
    }

    signup(signupLastName: string, signupFirstName: string, signupEmail: string, signupPassword: string): Observable<any> {
        return this.http.post(this.AUTH_API + '/signup', {
            signupLastName,
            signupFirstName,
            signupEmail,
            signupPassword
        });
    }
    
    getUserInfo(token: string | null): Observable<User> {
        return this.http.get<User>(this.AUTH_API + '/me');
    }

    public saveUser(user: User): void {
        this.authStatusSource.next({isLogged: true, user});
    }
}