//angular modules and services
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//interfaces
import { User } from 'src/app/interfaces/user.interface';
import { UserApiResponse } from './usersApiResponse.interface';
import { Post } from 'src/app/interfaces/post.interface';

const API_URL = 'http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo(id: string): Observable<User> {
    return this.http.get<User>(API_URL + `user/${id}`);
  }

  getUserPosts(id: string): Observable<Post[]> {
    return this.http.get<Post[]>(API_URL + `posts/from/${id}`);
  }

  getUserList(): Observable<User[]> {
    return this.http.get<User[]>(API_URL + 'user');
  }

  updateProfile(data: FormData): Observable<User> {
    return this.http.post<User>(API_URL + 'user', data);
  }

  changeUserRole(data: object): Observable<UserApiResponse> {
    return this.http.post<UserApiResponse>(API_URL + 'user/admin/changerole', data);
  }

  deleteAccount(userId: string): Observable<UserApiResponse> {
    return this.http.delete<UserApiResponse>(API_URL + 'user/' + userId);
  }
}