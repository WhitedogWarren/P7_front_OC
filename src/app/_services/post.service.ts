import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const POST_API = 'http://localhost:3000/api/posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<any> {
    return this.http.get(POST_API, { responseType: 'text'});
  }

  getPostShunk(postId: number): Observable<any> {
    return this.http.get(POST_API + '/shunk/' + postId, { responseType: 'text' });
  }

  getModeratedPosts(): Observable<any> {
    return this.http.get(POST_API + '/moderator/get_moderated_posts', { responseType: 'text' });
  }

  getReportedPosts(): Observable<any> {
    return this.http.get(POST_API + '/moderator/get_reported_posts', { responseType: 'text' });
  }
  
  createPost(content: FormData): Observable<any> {
    return this.http.post(POST_API, content);
  }

  deletePost(postId:string): Observable<any> {
    return this.http.delete(POST_API + '/' + postId);
  }

  editPost(postId: string, data: FormData): Observable<any> {
    return this.http.put(POST_API + '/' + postId, data);
  }

  reportPost(postId: string, userId: string): Observable<any> {
    return this.http.post(POST_API + '/report', {postId: postId, userId: userId});
  }

  unreportPost(postId: string, userId: string, userRole: string): Observable<any> {
    if(userRole !== 'user')
      return this.http.post(POST_API + '/moderator/unreport', {postId: postId, userId: userId});
    else
      return this.http.post(POST_API + '/unreport', {postId: postId, userId:userId});
  }

  moderatePost(postId: string, reason: string): Observable<any> {
    return this.http.post(POST_API + '/moderator/moderate_post', {postId: postId, reason: reason});
  }

  unmoderatePost(postId: string): Observable<any> {
    return this.http.post(POST_API + '/moderator/unmoderate_post', {postId: postId});
  }

  notifyCorrection(postId: string): Observable<any> {
    return this.http.post(POST_API + '/notify_correction', {postId: postId});
  }

  avoidCorrection(postId: string): Observable<any> {
    return this.http.post(POST_API + '/avoid_correction', {postId: postId});
  }

  
  setReaction(postId: string, userId: string, reaction: string): Observable<any> {
    return this.http.post(POST_API + '/' + reaction, { postId, userId});
  }

  unsetReaction(postId: string, userId: string, reaction: string): Observable<any> {
    return this.http.post(POST_API + '/un' + reaction, {postId, userId});
  }
}
