import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo(id: string): Observable<any> {
    return this.http.get(API_URL + `user/${id}`, { responseType: 'text' });
  }

  getUserList(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  updateProfile(data: FormData): Observable<any> {
    return this.http.post(API_URL + 'user', data);
  }

  changeUserRole(data: object): Observable<any> {
    return this.http.post(API_URL + 'user/admin/changerole', data, {responseType: 'text'});
  }

  deleteAccount(): Observable<any> {
    return this.http.post(API_URL + 'user/delete', { responseType: 'text'});
  }
}
