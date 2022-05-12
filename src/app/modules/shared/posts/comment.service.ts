import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { CommentApiResponse } from './commentApiResponse.interface';

const COMMENT_API = 'http://localhost:3000/api/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  createComment(postId: number, content: { content: string }): Observable<CommentApiResponse> {
    return this.http.post<CommentApiResponse>(`${COMMENT_API}/${postId}`, content);
  }

  deleteComment(commentId: number): Observable<CommentApiResponse> {
    return this.http.delete<CommentApiResponse>(`${COMMENT_API}/${commentId}`);
  }

  updateComment(commentId: number, content: { content:string }): Observable<CommentApiResponse> {
    return this.http.put<CommentApiResponse>(`${COMMENT_API}/${commentId}`, content);
  }
}
