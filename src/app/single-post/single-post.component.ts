import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { NotificationService } from '../_services/notification.service';
import { PostService } from '../_services/post.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ReactionDialogComponent } from '../reaction-dialog/reaction-dialog.component';

export interface DialogData {
  userId: string;
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
  @Input() post!:any;
  @Input() userId!: string;
  @Input() user!: any;
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
  liked!: Array<string>;
  loved!: Array<string>;
  laughed!: Array<string>;
  angered!: Array<string>;
  currentReaction!: string;
  
  constructor(private postService: PostService, private notificationService: NotificationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentReaction = 'none';
    this.liked = JSON.parse(this.post.liked);
    if(this.liked.includes(this.userId))
      this.currentReaction = 'like';
    this.loved = JSON.parse(this.post.loved);
    if(this.loved.includes(this.userId))
      this.currentReaction = 'love';
    this.laughed = JSON.parse(this.post.laughed);
    if(this.laughed.includes(this.userId))
      this.currentReaction = 'laugh';
    this.angered = JSON.parse(this.post.angered);
    if(this.angered.includes(this.userId))
      this.currentReaction = 'anger';
  }

  showPost(): Boolean {
    if(this.user.userRole == 'user') {
      if(this.userId !== this.post.User.id && this.post.moderated) {
        return false;
      }
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
      else
        document.getElementsByClassName('image-adding__thumb')[0].setAttribute('src', URL.createObjectURL(file));
    }
    //////
    // TODO : vérifier l'état du bouton "delete_image"
    //////
    this.deleteImage = false;
    document.getElementsByClassName('image-editor__delete')[0].setAttribute('src', "../../assets/images/boutons/trash.png");
    document.getElementsByClassName('image-editor__delete')[0].setAttribute('alt', "supprimer l'image");
    document.getElementsByClassName('image-editor__delete')[0].setAttribute('title', "supprimer l'image");
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
  
  onSubmit(): void {
    let myFormData = new FormData();
    myFormData.append('editedContent', this.postEditForm.value.editedContent);
    myFormData.append('postId', this.post.id);
    if(this.deleteImage)
      myFormData.append('deleteImage', "true");
    else {
      if(this.fileName) {
        myFormData.append('file', this.postedFile, `postImage_${this.fileName}`);
      }
    }
    this.postService.editPost(this.userId, myFormData).subscribe(data => {
      console.log(data);
      window.location.reload();
    });
  }

  cancelEdition(): void {
    this.editMode = false;
  }

  deletePost(): void {
    this.postService.deletePost(this.post.id).subscribe(
      data => {
        window.location.reload();
      }
    );
  }

  activateModerationForm(): void {
    console.log('modération activée')
    this.moderateMode = true;
  }
  deactivateModerationForm(): void {
    console.log('modération désactivée')
    this.moderateMode = false;
  }

  moderatePost(): void {
    this.postService.moderatePost(this.post.id, this.postmoderationForm.value.reasonForModeration).subscribe(data => {
      window.location.reload();
    });
  }
  unmoderatePost(): void {
    this.postService.unmoderatePost(this.post.id).subscribe(data => {
      window.location.reload();
    });
  }

  sendCorrection(): void {
    this.postService.notifyCorrection(this.post.id).subscribe(data => {
      window.location.reload();
    })
  }

  avoidCorrection(): void {
    console.log('annulation de correction demandée');
    this.postService.avoidCorrection(this.post.id).subscribe(data => {
      window.location.reload();
    })
  }

  reportPost(): void {
    this.postService.reportPost(this.post.id, this.userId).subscribe(data => {
      window.location.reload();
    })
  }

  unreportPost(): void {
    console.log('annulation de signalement demandée par ' + this.userId + ' pour le post n°' + this.post.id);
    this.postService.unreportPost(this.post.id, this.userId, this.user.userRole).subscribe(data => {
      //console.log(data);
      window.location.reload();
    })
  }

  likePost(): void {
    //console.log('post liké');
    if(this.currentReaction == 'none') {
      this.postService.setReaction(this.post.id, this.userId, 'like').subscribe(data => {
        console.log(data);
        window.location.reload()
      })
    }
    else {
      this.openDialog(this.currentReaction, 'like');
    }
  }
  
  lovePost(): void {
    //console.log('Post adoré');
    //this.notificationService.showInfo('ceci est votre premier toast.', 'Bravo !', {closeButton: true, positionClass: 'toast-center-center'});
    
    if(this.currentReaction == 'none') {
      this.postService.setReaction(this.post.id, this.userId, 'love').subscribe(data => {
        console.log(data);
        window.location.reload()
      })
    }
    else {
      this.openDialog(this.currentReaction, 'love');
    }
  }

  laughPost(): void {
    if(this.currentReaction == 'none') {
      this.postService.setReaction(this.post.id, this.userId, 'laugh').subscribe(data => {
        console.log(data);
        window.location.reload()
      })
    }
    else {
      this.openDialog(this.currentReaction, 'laugh');
    }
  }

  angerPost(): void {
    if(this.currentReaction == 'none') {
      this.postService.setReaction(this.post.id, this.userId, 'anger').subscribe(data => {
        console.log(data);
        window.location.reload()
      })
    }
    else {
      this.openDialog(this.currentReaction, 'anger');
    }
  }

  
  openDialog(currentReaction: string, askedReaction: string): void {

    let DialogConfig = {
      width: '250px',
      data: {userId: this.userId, postId: this.post.id, currentReaction: this.currentReaction, askedReaction}
    }

    const dialogRef = this.dialog.open(ReactionDialogComponent, DialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('Résultat : ');
        console.log(result);
        if(result.handler == 'unset') {
          console.log('unset');
          this.postService.unsetReaction(this.post.id, this.userId, result.reaction).subscribe(data => {
            console.log(data);
            window.location.reload();
          })
        }
        if(result.handler == 'replace') {
          console.log('replace');
          this.postService.unsetReaction(this.post.id, this.userId, this.currentReaction).subscribe(data => {
            console.log(data);
            console.log('result.askedReaction : ' + result.askedReaction);
            this.postService.setReaction(this.post.id, this.userId, result.reaction).subscribe(data => {
              console.log(data);
              window.location.reload();
            })
          })
        }
      }
    })
  }
}


