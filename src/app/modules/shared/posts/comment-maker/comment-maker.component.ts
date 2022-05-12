import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { take } from 'rxjs';
import { Post } from 'src/app/interfaces/post.interface';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/_services/auth.service';
import { CommentService } from '../comment.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-comment-maker',
  templateUrl: './comment-maker.component.html',
  styleUrls: ['./comment-maker.component.scss']
})
export class CommentMakerComponent implements OnInit {
  @Input() post!: Post;
  @Output() closeCommentCreation = new EventEmitter<boolean>();
  user!: User | null;
  commentMakerForm = this.formBuilder.group({
    postedContent: ['']
  })
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private commentService:CommentService, private postService: PostService) { }

  ngOnInit(): void {
    this.authService.authStatus$.pipe(take(1)).subscribe({
      next: authStatus => {
        this.user = authStatus.user;
      }
      
    })
  }

  avoidCommentCreation(): void {
    this.closeCommentCreation.emit(true);
  }

  onSubmit(): void {
    if(this.user){
      this.commentService.createComment(this.post.id, { content: this.commentMakerForm.value.postedContent }).pipe(take(1)).subscribe({
        next:apiResponse => {
          let newComment = apiResponse.newComment;
          //////
          // set comment.User with connected user values
          //////
          if(newComment && this.user) {
            newComment.User = {
              id: parseInt(this.user.id),
              firstname: this.user.firstname,
              lastname: this.user.lastname,
              avatarUrl: this.user.avatarUrl
            }
          }
          //////
          // update postData
          //////
          this.postService.postsData$.pipe(take(1)).subscribe({
            next: postData => {
              if(newComment) {
                for(let post of postData)  {
                  if(post.id == this.post.id) {
                    post.Comments.push(newComment)
                  }
                }
              }
              this.postService.postsDataSource.next(postData);
              this.closeCommentCreation.emit(true);
            }
          })

        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

}
