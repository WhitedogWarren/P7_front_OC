import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { User } from '../interfaces/user.interface';
import { NotificationService } from '../_services/notification.service';
import { PostService } from '../_services/post.service';
import { Post } from '../interfaces/post.interface';

import { ReactionDialogComponent } from '../reaction-dialog/reaction-dialog.component';
import { AuthService } from '../_services/auth.service';



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
  @Input() user!: any;
  @Output('childCalls') childCalls: EventEmitter<any> = new EventEmitter();
  editMode:Boolean = false;
  moderateMode: Boolean = false;
  fileName = '';
  postedFile!: File;
  deleteImage: Boolean = false;
  postEditForm = new FormGroup({
    editedContent: new FormControl('')
  })
  postmoderationForm = new FormGroup({
    reasonForModeration: new FormControl('')
  })
  liked!: Array<number>;
  loved!: Array<number>;
  laughed!: Array<number>;
  angered!: Array<number>;
  currentReaction!: string;
  
  constructor(private postService: PostService, private authService: AuthService, private notificationService: NotificationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    //console.log(this.post);
    this.currentReaction = 'none';
    this.liked = JSON.parse(this.post.liked);
    if(this.liked.includes(this.user.id))
      this.currentReaction = 'like';
    this.loved = JSON.parse(this.post.loved);
    if(this.loved.includes(this.user.id))
      this.currentReaction = 'love';
    this.laughed = JSON.parse(this.post.laughed);
    if(this.laughed.includes(this.user.id))
      this.currentReaction = 'laugh';
    this.angered = JSON.parse(this.post.angered);
    if(this.angered.includes(this.user.id))
      this.currentReaction = 'anger';
  }

  showPost(): Boolean {
    if(this.user.role == 'user') {
      if(this.user.id !== this.post.User.id && this.post.moderated)
        return false;
    }
    return true;
  }

  editPost(): void {
    this.editMode = true;
    this.postEditForm.setValue({'editedContent': this.post.content});
  }

  onFileSelected(event: any): void {
    this.deleteImage = false;
    const file:File = event.target.files[0];
    if(file) {
      this.fileName = file.name;
      this.postedFile = file;
      if(this.post.imageUrl)
        document.getElementsByClassName('image-editor__thumb')[0].setAttribute('src', URL.createObjectURL(file));
      else {
        document.getElementsByClassName('image-adding__thumb')[0].setAttribute('src', URL.createObjectURL(file));
      }
    }
    this.deleteImage = false;
    if(document.getElementsByClassName('image-editor__delete')[0]) {
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('src', "../../assets/images/boutons/trash.png");
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('alt', "supprimer l'image");
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('title', "supprimer l'image");
    }
  }

  onAvoidImageAdding(): void {
    this.fileName = '';
    document.getElementsByClassName('image-adding__thumb')[0].setAttribute('src', "../../assets/images/boutons/picture.png");
  }

  onDeleteImage(): void {
    if(!this.deleteImage) {
      this.deleteImage = true;
      document.getElementsByClassName('image-editor__thumb')[0].setAttribute('src', "../../assets/images/boutons/delete_picture.png");
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('src', "../../assets/images/boutons/undo.png");
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('alt', "annuler la suppression d'image");
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('title', "annuler la suppression d'image");
    }
    else {
      this.deleteImage = false;
      if(!this.fileName)
        document.getElementsByClassName('image-editor__thumb')[0].setAttribute('src', "http://localhost:3000/images/postImage/" + this.post.imageUrl);
      else
      document.getElementsByClassName('image-editor__thumb')[0].setAttribute('src', URL.createObjectURL(this.postedFile));
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('src', "../../assets/images/boutons/trash.png");
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('alt', "supprimer l'image");
      document.getElementsByClassName('image-editor__delete')[0].setAttribute('title', "supprimer l'image");
    }
  }
  
  onEditPost(): void {
    let myFormData = new FormData();
    myFormData.append('editedContent', this.postEditForm.value.editedContent);
    myFormData.append('postId', this.post.id.toString());
    if(this.deleteImage)
      myFormData.append('deleteImage', "true");
    else {
      if(this.fileName) {
        myFormData.append('file', this.postedFile, `postImage_${this.fileName}`);
      }
    }
    this.postService.editPost(this.user.id, myFormData).subscribe({
      next: (data) => {
        this.post = data.newPost;
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
        this.cancelEdition();
      },
      error: (err) => {
        console.log(err.error.message);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
      }
    })
  }

  cancelEdition(): void {
    this.editMode = false;
  }

  deletePost(): void {
    this.postService.deletePost(this.post.id.toString()).subscribe({
      next:data => {
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    });
  }

  activateModerationForm(): void {
    this.moderateMode = true;
  }
  deactivateModerationForm(): void {
    this.moderateMode = false;
  }

  moderatePost(): void {
    this.postService.moderatePost(this.post.id.toString(), this.postmoderationForm.value.reasonForModeration).subscribe({
      next: data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        this.post = data.newPost;
        this.deactivateModerationForm();
      },
      error: err => {
        console.log(err.error.message);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    })
  }


  unmoderatePost(): void {
    this.postService.unmoderatePost(this.post.id.toString()).subscribe({
      next: data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        this.post = data.newPost;
      },
      error: (err) => {
        console.log(err.error.message);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    });
  }

  sendCorrection(): void {
    this.postService.notifyCorrection(this.post.id.toString()).subscribe({
      next:data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        this.post = data.newPost;
      },
      error: (err) => {
        console.log(err.error.message);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    })
  }

  avoidCorrection(): void {
    console.log('annulation de correction demandée');
    this.postService.avoidCorrection(this.post.id.toString()).subscribe({
      next: data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        this.post = data.newPost;
      },
      error: (err) => {
        console.log(err.error.message);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    })
  }

  reportPost(): void {
    this.postService.reportPost(this.post.id.toString(), this.user.id).subscribe({
      next: data => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        this.post = data.newPost;
      },
      error: (err) => {
        console.log(err.error.message);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    })
  }

  unreportPost(): void {
    this.postService.unreportPost(this.post.id.toString(), this.user.id, this.user.role).subscribe({
      next: data => {
        console.log(data);
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
        this.post = data.newPost;
      },
      error: (err) => {
        console.log(err.error.message);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    })
  }

  reactToPost(reaction: string): void {
    console.log(this.currentReaction);
    if(this.currentReaction == 'none') {
      this.postService.setReaction(this.post.id.toString(), this.user.id, reaction).subscribe({
        next: data => {
          this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
          this.post = data.newPost;
          this.liked = JSON.parse(data.newPost.liked);
          this.loved = JSON.parse(data.newPost.loved);
          this.laughed = JSON.parse(data.newPost.laughed);
          this.angered = JSON.parse(data.newPost.angered);
          this.currentReaction = reaction;
        },
        error: (err) => {
          console.log(err.error.message);
          if(err.error.message == 'jwt expired') {
            this.authService.signOut();
            window.location.reload();
          }
        }
      })
    }
    else {
      this.openReactionDialog(this.currentReaction, reaction);
    }
  }

  
  openReactionDialog(currentReaction: string, askedReaction: string): void {
    let DialogConfig = {
      width: '250px',
      data: {userId: this.user.id, postId: this.post.id, currentReaction: this.currentReaction, askedReaction}
    }
    const dialogRef = this.dialog.open(ReactionDialogComponent, DialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(result.handler == 'unset') {
          this.postService.unsetReaction(this.post.id.toString(), this.user.id, result.reaction).subscribe(data => {
            console.log(data);
            this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
            this.post = data.newPost;
            this.liked = JSON.parse(data.newPost.liked);
            this.loved = JSON.parse(data.newPost.loved);
            this.laughed = JSON.parse(data.newPost.laughed);
            this.angered = JSON.parse(data.newPost.angered);
            this.currentReaction = 'none';
          })
        }
        if(result.handler == 'replace') {
          this.postService.unsetReaction(this.post.id.toString(), this.user.id, this.currentReaction).subscribe(data => {
            console.log('result.reaction : ' + result.reaction);
            this.postService.setReaction(this.post.id.toString(), this.user.id, result.reaction).subscribe(data => {
              this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'})
              this.post = data.newPost;
              this.liked = JSON.parse(data.newPost.liked);
              this.loved = JSON.parse(data.newPost.loved);
              this.laughed = JSON.parse(data.newPost.laughed);
              this.angered = JSON.parse(data.newPost.angered);
              this.currentReaction = result.reaction;
            })
          })
        }
      }
    })
  }

  

  onCallParent(): void {
    this.childCalls.emit();
  }
}


