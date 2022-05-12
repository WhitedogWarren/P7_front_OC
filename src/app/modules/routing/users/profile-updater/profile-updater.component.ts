// angular modules and services
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';

//app services
import { UserService } from '../user.service';
import { NotificationService } from '../../../../_services/notification.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PostService } from 'src/app/modules/shared/posts/post.service';

//interfaces
import { User } from '../../../../interfaces/user.interface';
import { Post } from 'src/app/interfaces/post.interface';

//components
import { AccountDeletingDialogComponent } from '../account-deleting-dialog/account-deleting-dialog.component';


@Component({
  selector: 'app-profile-updater',
  templateUrl: './profile-updater.component.html',
  styleUrls: ['./profile-updater.component.scss']
})
export class ProfileUpdaterComponent implements OnInit {
  user!: User | null;
  postsData!: Array<Post>
  postedFile!: File;
  pattern: string = '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$';
  updateProfileForm = this.formBuilder.group({
    postedLastName: ['', [Validators.required, Validators.minLength(2)]],
    postedFirstName: ['', [Validators.required, Validators.minLength(2)]],
    avatarInput: [''],
    bioInput: [''],
    postedCurrentPassword: ['', [Validators.pattern(this.pattern)]],
    postedNewPassword1: ['', [Validators.pattern(this.pattern)]],
    postedNewPassword2: ['', [Validators.pattern(this.pattern)]]
  });
  errorMessage = '';

  constructor(private authService: AuthService, private userService: UserService, private postService: PostService, private notificationService: NotificationService, public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.authService.authStatus$.subscribe({
      next: authStatus => {
        this.user = authStatus.user;
      }
    })
    let bio: string;
    if(!this.user?.bio) {
      bio = '';
    }
    else {
      bio = this.user.bio;
    }
    this.updateProfileForm.setValue({postedLastName: this.user?.lastname, postedFirstName: this.user?.firstname, postedCurrentPassword: '', postedNewPassword1: '', postedNewPassword2: '', avatarInput: '', bioInput: bio});
    if(this.user) {
      this.postService.postsData$.subscribe( data => {
        if(this.user) {
          this.user.posts = data.reverse();
        }
      })
      this.userService.getUserPosts(this.user.id).pipe(take(1)).subscribe({
        next: data => {
          if(this.user) {
            this.postService.postsDataSource.next(data);
          }
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  onSubmit(): void {
    /*
    if(!this.updateProfileForm.valid) {
      this.notificationService.showError('Certains champs sont invalides !', 'Erreur :', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
      return;
    }
    */
    const { postedLastName, postedFirstName, postedCurrentPassword, postedNewPassword1, postedNewPassword2  } = this.updateProfileForm.value;
    let myFormData = new FormData();
    if(this.user) {
      myFormData.append('userId', this.user.id.toString());
    }
    myFormData.append('lastname', postedLastName);
    myFormData.append('firstname', postedFirstName);
    if(this.postedFile) {
      myFormData.append('file', this.postedFile, `avatars_${this.postedFile.name}`);
    }
    if(this.updateProfileForm.value.bioInput) {
      myFormData.append('bio', this.updateProfileForm.value.bioInput);
    }
    if(this.updateProfileForm.value.postedCurrentPassword || this.updateProfileForm.value.postedNewPassword1 || this.updateProfileForm.value.postedNewPassword2) {
      if(!this.updateProfileForm.value.postedCurrentPassword || !this.updateProfileForm.value.postedNewPassword1 || !this.updateProfileForm.value.postedNewPassword2) {
        this.notificationService.showError('Pour changer de mot de passe, vous devez remplir tous les champs requis :<br/>- Votre ancien mot de passe<br/>- votre nouveau mot de passe<br/>- Votre nouveau mot de passe une seconde fois', 'Erreur', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
        return;
      }
      else {
        if(this.updateProfileForm.value.postedNewPassword1 !== this.updateProfileForm.value.postedNewPassword2) {
          this.notificationService.showError('Les champs "entrez le nouveau mot de passe" et "Confirmez le nouveau mot de passe" contiennent des valeurs différentes', 'Erreur', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
          return;
        }
        else {
          const passwordRegexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
          if(!passwordRegexp.test(this.updateProfileForm.value.postedNewPassword1)) {
            this.notificationService.showError('Le mot de passe demandé n\'est pas valide.<br/>Celui-ci doit contenir :<br/>- Au moins 8 caractères<br/>- Au moins une majuscule<br/>- Au moins une minuscule<br/>- Au moins un chiffre', '',  {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
            return;
          }
          else {
            myFormData.append('postedCurrentPassword', postedCurrentPassword);
            myFormData.append('postedNewPassword1', postedNewPassword1);
            myFormData.append('postedNewPassword2', postedNewPassword2);
          }
        }
      }
    }
    
    this.userService.updateProfile(myFormData).pipe(take(1)).subscribe({
      next: (data) => {
        let newData = { ...data };
        this.authService.saveUser(newData);
        this.updateProfileForm.patchValue({postedCurrentPassword: '', postedNewPassword1: '', postedNewPassword2: ''})
        this.notificationService.showSuccess('Profil mis à jour', '', {closeButton: true, positionClass: 'toast-bottom-center'});
      },
      error: (err) => {
        console.error(err.error.message);
        let errorMessage = '';
        if(err.error.message.emptyFields) {
          console.log('champs vides : \n' + err.error.message.emptyFields.join('\n'));
          if(err.error.message.emptyFields.length < 2)
            errorMessage += `Le champ ${err.error.message.emptyFields[0]} est vide !`;
          else
            errorMessage += `Les champs suivants sont vides :<br>${err.error.message.emptyFields.join('<br>')}`;
        }
        if(err.error.message.invalidFields) {
          if(err.error.message.emptyFields)
            errorMessage += '<br><br>';
          if(err.error.message.invalidFields.length < 2)
            errorMessage += `Le champs ${err.error.message.invalidFields[0]} est invalide !`;
          else
            errorMessage += `Les champs suivants sont invalides :<br>${err.error.message.invalidFields.join('<br>')}`;
        }
        this.notificationService.showError(errorMessage, 'Erreur !', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
      }
    });
  }

  avatarHandler(event: any) {
    this.postedFile = event.target.files[0];
    document.getElementsByClassName('avatar-image')[0].setAttribute('src', URL.createObjectURL(this.postedFile));
  }

  openAccountDeletingDialog(): void {
    let DialogConfig = {
      width: '250px',
      data: {}
    }
    const dialogRef = this.dialog.open(AccountDeletingDialogComponent, DialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(this.user && result.handler == 'confirm') {
          this.userService.deleteAccount(this.user.id).subscribe({
            next: (data) => {
              this.authService.signOut();
              this.router.navigate(['/auth/login']);
            }
          })
        }
      }
    })
  }

  deleteAccount(): void {
    this.openAccountDeletingDialog();
  }
}