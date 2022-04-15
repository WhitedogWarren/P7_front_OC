import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/authStatus.interface';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    constructor(private http: HttpClient) {
        console.log('authService init');
        if(window.sessionStorage.getItem('auth-token'))  {
            
            this.getUserInfo(window.sessionStorage.getItem('auth-token')).subscribe({
                next: data => {
                    this.authStatusSource.next({isLogged: true, user: data});
                    
                    this.userInfos = data;
                    console.log('Dans le constructeur authservice :');
                    console.log(this.userInfos);
                }})
            //
        }
        this.authStatus$.subscribe({
            next: authStatus => {
                this.userInfos = authStatus.user;
            }
        })
    }

    AUTH_API = 'http://localhost:3000/api/auth';
    
    public userInfos!: User | null;
    public authStatusSource = new Subject<AuthStatus>();
    authStatus$ = this.authStatusSource.asObservable();

    login(loginEmail: string, loginPassword: string): Observable<any> {
        return this.http.post(this.AUTH_API + '/login', {
            loginEmail,
            loginPassword
        });
    }

    
    public signOut(): void {
        window.sessionStorage.clear();
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
        this.userInfos = user;
    }

    public getUser(): User | null {
        console.log('getUser demandé');
        console.log('from authservice : ');
        console.log(this.userInfos);
        return this.userInfos;
    }
}