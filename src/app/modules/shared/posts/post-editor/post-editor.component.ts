import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

//app services
import { NotificationService } from '../../../../_services/notification.service';
import { PostService } from '../post.service';
import { AuthService } from '../../../../_services/auth.service';

//interfaces
import { Post } from '../../../../interfaces/post.interface';
import { User } from 'src/app/interfaces/user.interface';


@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {
  @Input() post!:Post;
  @Input() user!: User | null;
  @Output() cancelEvent = new EventEmitter<string>();
  
  editMode:Boolean = false;
  moderateMode: Boolean = false;
  fileName = '';
  postedFile!: File;
  deleteImage: Boolean = false;
  postEditForm = this.formBuilder.group({
    editedContent: ['', [Validators.required]]
  })
  constructor(private postService: PostService, private formBuilder: FormBuilder, private authService: AuthService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.postEditForm.setValue({'editedContent': this.post.content});
  }

  onEditPost(): void {
    if(this.user) {
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
      this.postService.editPost(this.user.id.toString(), myFormData).pipe(take(1)).subscribe({
        next: (data) => {
          let newPostsData: Array<Post> = [];
          if(data.newPost) {
            this.post = data.newPost;
          }
          this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
          // Mettre à jour le postData du parent
          let subscription = this.postService.postsData$.subscribe({
            next: postsData => {
              for(let post of postsData) {
                if(data.newPost && post.id == this.post.id) {
                  newPostsData.push(data.newPost);
                }
                else {
                  newPostsData.push(post);
                }
              }
            }
          })
          subscription.unsubscribe();
          this.postService.postsDataSource.next(newPostsData);
          //fermer l'éditeur
          this.cancelEdition();
        },
        error: (err) => {
          console.log(err.error.message);
          this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
        }
      })
    }
    else {
      this.authService.authStatusSource.next({isLogged: false, user: null});
      this.router.navigate(['auth/login']);
    }
  }

  cancelEdition(): void {
    this.cancelEvent.emit();
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
}