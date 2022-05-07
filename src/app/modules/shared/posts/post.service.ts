import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Post } from 'src/app/interfaces/post.interface';
import { PostApiResponse } from './postApiResponse.interface';

const POST_API = 'http://localhost:3000/api/posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  public postsDataSource = new BehaviorSubject<Array<Post>>([]);
  postsData$ = this.postsDataSource.asObservable();

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(POST_API);
  }

  getPostShunk(postId: number): Observable<Post[]> {
    return this.http.get<Post[]>(POST_API + '/shunk/' + postId);
  }

  getModeratedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(POST_API + '/moderator/get_moderated_posts');
  }

  getReportedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(POST_API + '/moderator/get_reported_posts');
  }
  
  createPost(content: FormData): Observable<PostApiResponse> {
    return this.http.post<PostApiResponse>(POST_API, content);
  }

  deletePost(postId:string): Observable<PostApiResponse> {
    return this.http.delete<PostApiResponse>(POST_API + '/' + postId);
  }

  editPost(postId: string, data: FormData): Observable<PostApiResponse> {
    return this.http.put<PostApiResponse>(POST_API + '/' + postId, data);
  }

  reportPost(postId: string, userId: string): Observable<PostApiResponse> {
    return this.http.post<PostApiResponse>(POST_API + '/report', {postId: postId, userId: userId});
  }

  unreportPost(postId: string, userId: string, userRole: string): Observable<PostApiResponse> {
    if(userRole !== 'user')
      return this.http.post<PostApiResponse>(POST_API + '/moderator/unreport', {postId: postId, userId: userId});
    else
      return this.http.post<PostApiResponse>(POST_API + '/unreport', {postId: postId, userId:userId});
  }

  moderatePost(postId: string, reason: string): Observable<PostApiResponse> {
    return this.http.post<PostApiResponse>(POST_API + '/moderator/moderate_post', {postId: postId, reason: reason});
  }

  unmoderatePost(postId: string): Observable<PostApiResponse> {
    return this.http.post<PostApiResponse>(POST_API + '/moderator/unmoderate_post', {postId: postId});
  }

  notifyCorrection(postId: string): Observable<PostApiResponse> {
    return this.http.post<PostApiResponse>(POST_API + '/notify_correction', {postId: postId});
  }

  avoidCorrection(postId: string): Observable<PostApiResponse> {
    return this.http.post<PostApiResponse>(POST_API + '/avoid_correction', {postId: postId});
  }

  
  setReaction(postId: string, userId: string, reaction: string): Observable<PostApiResponse> {
    return this.http.post<PostApiResponse>(POST_API + '/' + reaction, { postId, userId});
  }

  unsetReaction(postId: string, userId: string, reaction: string): Observable<PostApiResponse> {
    return this.http.post<PostApiResponse>(POST_API + '/un' + reaction, {postId, userId});
  }
}
