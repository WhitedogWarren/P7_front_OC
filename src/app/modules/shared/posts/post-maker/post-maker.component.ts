//angular modules and services
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

//app services
import { AuthService } from '../../../../_services/auth.service';
import { NotificationService } from '../../../../_services/notification.service';
import { PostService } from '../post.service';

//interfaces
import { Post } from 'src/app/interfaces/post.interface';

@Component({
  selector: 'app-post-maker',
  templateUrl: './post-maker.component.html',
  styleUrls: ['./post-maker.component.scss']
})
export class PostMakerComponent {
  @Input() userId?: string;
  @ViewChild('fileUpload', {static: false})
  InputVar!: ElementRef;
  
  fileName = '';
  postedFile!:File | null;
  activePostmaking: boolean = false;
  postMakerForm = this.formBuilder.group({
    postedContent: ['']
  })
  constructor(private postService: PostService, private notificationService: NotificationService, private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  onSubmit(): void {
    if(this.userId) {
      let myFormData = new FormData();
      myFormData.append('postedContent', this.postMakerForm.value.postedContent);
      myFormData.append('userId', this.userId);
      if(this.fileName) {
        if(this.postedFile) {
          myFormData.append('file', this.postedFile, `postImage_${this.fileName}`);
        }
      }
      this.postService.createPost(myFormData).pipe(take(1)).subscribe({
        next: data => {
          let newData:Array<Post> = [];
          this.postService.postsData$.pipe(take(1)).subscribe(postData => {
            newData = postData;
            if(data.newPost) {
              newData.unshift(data.newPost);
            }
          })
          this.postService.postsDataSource.next(newData);
          this.postMakerForm.setValue({postedContent: ''});
          this.avoidPostMaking();
          this.notificationService.showSuccess(data.message, '', {closeButton: true, positionClass: 'toast-bottom-center'});
        },
        error: err => {
          this.notificationService.showError(err.error.message, 'Erreur', {closeButton: true, positionClass: 'toast-bottom-center'});
        }
      })
    }
    else {
      this.authService.signOut();
      this.router.navigate(['/homepage']);
    }
  }

  activatePostmaking(): void {
    this.activePostmaking = true;
  }
  avoidPostMaking(): void {
    this.activePostmaking = false;
    this.avoidImageAdding();
  }

  onFileSelected(event: any): void {
    const file:File = event.target.files[0];
    if(file) {
      this.fileName = file.name;
      this.postedFile = file;
      console.log(document.getElementsByClassName('posted-file-preview-box__image-viewer')[0]);
      document.getElementsByClassName('posted-file-preview-box__image')[0].setAttribute('src', URL.createObjectURL(this.postedFile));
    }
  }
  avoidImageAdding(): void {
    document.getElementsByClassName('posted-file-preview-box__image')[0].setAttribute('src', '');
    this.fileName = '';
    this.postedFile = null;
    this.InputVar.nativeElement.value = [];
  }
}