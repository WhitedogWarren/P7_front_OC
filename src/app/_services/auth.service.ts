import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:3000/api/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    login(loginEmail: string, loginPassword: string): Observable<any> {
        return this.http.post(AUTH_API + 'auth/login', {
            loginEmail,
            loginPassword
        }, httpOptions);
    }

    signup(signupLastName: string, signupFirstName: string, signupEmail: string, signupPassword: string): Observable<any> {
        return this.http.post(AUTH_API + 'auth/signup', {
            signupLastName,
            signupFirstName,
            signupEmail,
            signupPassword
        }, httpOptions);
    }
    
}