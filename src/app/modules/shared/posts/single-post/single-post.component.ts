//angular modules and services
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';

//app services
import { NotificationService } from '../../../../_services/notification.service';
import { PostService } from '../post.service';
import { AuthService } from '../../../../_services/auth.service';

//interfaces
import { Post } from '../../../../interfaces/post.interface';
import { User } from 'src/app/interfaces/user.interface';

//components
import { ReactionDialogComponent } from '../reaction-dialog/reaction-dialog.component';


export interface DialogData {
  postId: string;
  askedReaction: string;
  currentReaction: string;
  outputHandler: string;
}

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  @Input() post!:Post;
  @Input() user!: User | null;
  
  editMode:Boolean = false;
  moderateMode: Boolean = false;
  commentCreationMode: Boolean = false;
  fileName = '';
  postedFile!: File;
  deleteImage: Boolean = false;
  postmoderationForm = this.formBuilder.group({
    reasonForModeration: ['', [Validators.required]]
  })
  liked!: Array<string>;
  loved!: Array<string>;
  laughed!: Array<string>;
  angered!: Array<string>;
  currentReaction!: string;
  
  constructor(private postService: PostService, private authService: AuthService, private notificationService: NotificationService, public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.currentReaction = 'none';
    this.liked = JSON.parse(this.post.liked);
    if(this.user && this.liked.includes(this.user.id))
      {this.currentReaction = 'like';}
    this.loved = JSON.parse(this.post.loved);
    if(this.user && this.loved.includes(this.user.id))
      {this.currentReaction = 'love';}
    this.laughed = JSON.parse(this.post.laughed);
    if(this.user && this.laughed.includes(this.user.id))
      {this.currentReaction = 'laugh';}
    this.angered = JSON.parse(this.post.angered);
    if(this.user && this.angered.includes(this.user.id))
      {this.currentReaction = 'anger';}
  }

  private updateParents(newPost: Post) {
    let newData: Array<Post> = [];
    let subscription = this.postService.postsData$.subscribe({
      next: data => {
        for(let post of data) {
          post.id !== newPost.id ? newData.push(post) : newData.push(newPost);
        }
      }
    })
    subscription.unsubscribe();
    this.postService.postsDataSource.next(newData);
  }
  
  showPost(): Boolean {
    if(this.user && this.user.role == 'user' && this.user.id !== this.post.User.id && this.post.moderated) {
      return false;
    }
    return true;
  }

  editPost(): void {
    this.editMode = true;
  }
  
  cancelEdition(): void {
    this.editMode = false;
  }

  deletePost(): void {
    this.postService.deletePost(this.post.id.toString()).pipe(take(1)).subscribe({
      next: data => {
        let newPostsData:Array<Post> = [];
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
        let subscription = this.postService.postsData$.subscribe({
          next: postsData => {
            for(let post of postsData) {
              if(post.id !== this.post.id) {
                newPostsData.push(post);
                
              }
            }
          }
        })
        subscription.unsubscribe();
        this.postService.postsDataSource.next(newPostsData);
      },
      error: (err) => {
        console.log(err);
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    });
  }

  activateModerationForm(): void {
    this.moderateMode = true;
  }
  deactivateModerationForm(): void {
    this.moderateMode = false;
  }

  createComment(): void {
    this.commentCreationMode = true;
  }

  avoidCommentMaking(): void {
    this.commentCreationMode = false;
  }

  moderatePost(): void {
    this.postService.moderatePost(this.post.id.toString(), this.postmoderationForm.value.reasonForModeration).pipe(take(1)).subscribe({
      next: data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        if(data.newPost) {
          this.post = data.newPost;
        }
        this.deactivateModerationForm();
      },
      error: err => {
        console.log(err.error.message);
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    })
  }

  unmoderatePost(): void {
    this.postService.unmoderatePost(this.post.id.toString()).pipe(take(1)).subscribe({
      next: data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        if(data.newPost)
        {
          this.post = data.newPost;
          this.updateParents(data.newPost);
        }
      },
      error: (err) => {
        console.log(err.error.message);
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    });
  }

  sendCorrection(): void {
    this.postService.notifyCorrection(this.post.id.toString()).pipe(take(1)).subscribe({
      next:data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        if(data.newPost) {
          this.post = data.newPost;
        }
      },
      error: (err) => {
        console.log(err.error.message);
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    })
  }

  avoidCorrection(): void {
    this.postService.avoidCorrection(this.post.id.toString()).pipe(take(1)).subscribe({
      next: data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        if(data.newPost) {
          this.post = data.newPost;
        }
      },
      error: (err) => {
        console.log(err.error.message);
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    })
  }

  reportPost(): void {
    if(this.user) {
      this.postService.reportPost(this.post.id.toString(), this.user.id).pipe(take(1)).subscribe({
        next: data => {
          this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
          if(data.newPost) {
            this.post = data.newPost;
          }
        },
        error: (err) => {
          console.log(err.error.message);
          this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
        }
      })
    }
    else {
      this.authService.signOut();
      this.router.navigate(['auth/login']);
    }
  }

  unreportPost(): void {
    if(this.user) {
      this.postService.unreportPost(this.post.id.toString(), this.user.id, this.user.role).pipe(take(1)).subscribe({
        next: data => {
          console.log(data);
          this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
          if(data.newPost) {
            this.post = data.newPost;
            this.updateParents(data.newPost);
          }
          
        },
        error: (err) => {
          console.log(err.error.message);
          this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
        }
      })
    }
    else {
      this.authService.signOut();
      this.router.navigate(['auth/login']);
    }
  }

  reactToPost(reaction: string): void {
    if(!this.user) {
      this.authService.signOut();
      this.router.navigate(['auth/login']);
    }
    if(this.user && this.user.id !== this.post.User.id) {
      if(this.currentReaction == 'none') {
        this.postService.setReaction(this.post.id.toString(), this.user.id, reaction).pipe(take(1)).subscribe({
          next: data => {
            this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
            if(data.newPost) {
              this.post = data.newPost;
              this.liked = JSON.parse(data.newPost.liked);
              this.loved = JSON.parse(data.newPost.loved);
              this.laughed = JSON.parse(data.newPost.laughed);
              this.angered = JSON.parse(data.newPost.angered);
              this.currentReaction = reaction;
            }
          },
          error: (err) => {
            console.log(err.error.message);
            this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
          }
        })
      }
      else {
        this.openReactionDialog(this.currentReaction, reaction);
      }
    }
  }

  isCliquable(): boolean {
    if(this.user && this.user.id.toString() !== this.post.User.id.toString()) {
      return true;
    }
    else {
      return false;
    }
  }
  
  openReactionDialog(currentReaction: string, askedReaction: string): void {
    if(this.user) {
      let DialogConfig = {
        width: '250px',
        data: {userId: this.user.id, postId: this.post.id, currentReaction: this.currentReaction, askedReaction}
      }
      const dialogRef = this.dialog.open(ReactionDialogComponent, DialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if(result && this.user) {
          if(result.handler == 'unset') {
            this.postService.unsetReaction(this.post.id.toString(), this.user.id, result.reaction).pipe(take(1)).subscribe({
              next: data => {
                this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
                if(data.newPost) {
                  this.post = data.newPost;
                  this.liked = JSON.parse(data.newPost.liked);
                  this.loved = JSON.parse(data.newPost.loved);
                  this.laughed = JSON.parse(data.newPost.laughed);
                  this.angered = JSON.parse(data.newPost.angered);
                  this.currentReaction = 'none';
                }
              },
              error: err => {
                console.log(err.error.message);
                this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});    
              }
            })
          }
          if(this.user && result.handler == 'replace') {
            this.postService.unsetReaction(this.post.id.toString(), this.user.id, this.currentReaction).pipe(take(1)).subscribe({
              next:data => {
                if(this.user) {
                  this.postService.setReaction(this.post.id.toString(), this.user.id, result.reaction).pipe(take(1)).subscribe(data => {
                    this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
                    if(data.newPost) {
                      this.post = data.newPost;
                      this.liked = JSON.parse(data.newPost.liked);
                      this.loved = JSON.parse(data.newPost.loved);
                      this.laughed = JSON.parse(data.newPost.laughed);
                      this.angered = JSON.parse(data.newPost.angered);
                      this.currentReaction = result.reaction;
                    }
                  })
                }
              },
              error: err => {
                console.log(err.error.message);
                this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});    
              }
            })
          }
        }
      })
    }
    else {
      this.authService.signOut();
      this.router.navigate(['auth/login']);
    }
  }
}