// angular modules and services
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { take } from 'rxjs';

//app services
import { AuthService } from 'src/app/_services/auth.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { CommentService } from '../comment.service';
import { PostService } from '../post.service';

//interfaces
import { Comment } from 'src/app/interfaces/comment.interface';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment!:Comment;
  user!: User | null;
  editMode: boolean = false;
  commentEditorForm = this.formBuilder.group({
    postedContent: ['']
  })
  constructor(private authService: AuthService , private commentService: CommentService, private postService: PostService, private formBuilder: FormBuilder, private notificationService: NotificationService) { }

  ngOnInit(): void {
    //console.log(this.comment);
    // fill the textarea with actual value of this.comment.content
    this.commentEditorForm.setValue({'postedContent': this.comment.content});
    
    // initialize this.user
    this.authService.authStatus$.pipe(take(1)).subscribe({
      next: authStatus => {
        this.user = authStatus.user;
      }
    })
  }

  public onDeleteComment(): void {
    this.commentService.deleteComment(this.comment.id).pipe(take(1)).subscribe({
      next: data => {
        console.log(data);
        // update postData
        this.postService.postsData$.pipe(take(1)).subscribe({
          next: postData => {
            for(let post of postData) {
              if(post.id == this.comment.PostId) {
                for(let i=0;i<post.Comments.length;i++) {
                  if(post.Comments[i].id == this.comment.id) {
                    post.Comments.splice(i, 1);
                  }
                }
              }
            }
            this.postService.postsDataSource.next(postData);
          }
        })
        this.notificationService.showSuccess(data.message, '', {closeButton: true, positionClass: 'toast-bottom-center'});
      },
      error: err => {
        console.log(err);
        this.notificationService.showError(err.error.message, 'Erreur!', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    });
  }

  public onAskEditMode(): void {
    this.editMode = true;
  }

  public onAvoidEditMode() :void {
    this.editMode = false;
  }

  public onEditComment(): void {
    this.commentService.updateComment(this.comment.id, { content: this.commentEditorForm.value.postedContent}).pipe(take(1)).subscribe({
      next: data => {
        console.log('data reçu :');
        console.log(data);
        this.postService.postsData$.pipe(take(1)).subscribe({
          next: postData => {
            for(let post of postData) {
              if(data.newComment && post.id == data.newComment.PostId) {
                for(let comment of post.Comments) {
                  if(comment.id == data.newComment.id) {
                    comment.content = data.newComment.content;
                  }
                }
              }
            }
            this.postService.postsDataSource.next(postData);
            this.editMode = false;
          }
        })
      },
      error: err => {
        console.log(err);
      }
    })
  }
}