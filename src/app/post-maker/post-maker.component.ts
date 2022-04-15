import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { NotificationService } from '../_services/notification.service';
import { PostService } from '../_services/post.service';



@Component({
  selector: 'app-post-maker',
  templateUrl: './post-maker.component.html',
  styleUrls: ['./post-maker.component.scss']
})
export class PostMakerComponent implements OnInit {
  @Input() userId?: any;
  fileName = '';
  postedFile!:File;
  activePostmaking: boolean = false;
  postMakerForm = new FormGroup({
    postedContent: new FormControl('')
  })
  constructor(private postService: PostService, private notificationService: NotificationService, private authService: AuthService) { }

  ngOnInit(): void {
    
  }
  onSubmit(): void {
    let myFormData = new FormData();
    myFormData.append('postedContent', this.postMakerForm.value.postedContent);
    myFormData.append('userId', this.userId);
    if(this.fileName) {
      console.log('file detecté');
      myFormData.append('file', this.postedFile, `postImage_${this.fileName}`);
    }
    //////
    // TODO : prévalidation js
    //////
    this.postService.createPost(myFormData).subscribe({
      next: data => {
        console.log(data);
        window.location.reload();
      },
      error: err => {
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
        
        this.notificationService.showError(err.error.message, 'Erreur', {closeButton: true, positionClass: 'toast-bottom-center'});

      }
    })
  }
  onFileSelected(event: any): void {
    const file:File = event.target.files[0];
    if(file) {
      this.fileName = file.name;
      this.postedFile = file;
    }
  }
  activatePostmaking(): void {
    this.activePostmaking = true;
  }

}
