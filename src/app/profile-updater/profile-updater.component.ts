import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { NotificationService } from '../_services/notification.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { AccountDeletingDialogComponent } from '../account-deleting-dialog/account-deleting-dialog.component';
import { User } from '../interfaces/user.interface';


@Component({
  selector: 'app-profile-updater',
  templateUrl: './profile-updater.component.html',
  styleUrls: ['./profile-updater.component.scss']
})
export class ProfileUpdaterComponent implements OnInit {
  @Input() user!: User;
  postedFile!: File;
  updateProfileForm = new FormGroup({
    postedLastName: new FormControl(),
    postedFirstName: new FormControl(),
    avatarInput: new FormControl(null),
    bioInput: new FormControl(),
    postedCurrentPassword: new FormControl(),
    postedNewPassword1: new FormControl(),
    postedNewPassword2: new FormControl()
  });
  errorMessage = '';

  constructor(private tokenStorageService: TokenStorageService, private userService: UserService, private notificationService: NotificationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.user.avatarUrl);
    let bio: string;
    if(!this.user.bio) {
      bio = '';
    }
    else {
      bio = this.user.bio;
    }
    this.updateProfileForm.setValue({postedLastName: this.user.lastname, postedFirstName: this.user.firstname, postedCurrentPassword: '', postedNewPassword1: '', postedNewPassword2: '', avatarInput: '', bioInput: bio});
  }

  onSubmit(): void {
    const { postedLastName, postedFirstName, postedCurrentPassword, postedNewPassword1, postedNewPassword2  } = this.updateProfileForm.value;
    let myFormData = new FormData();
    myFormData.append('userId', this.user.id.toString());
    myFormData.append('lastname', postedLastName);
    myFormData.append('firstname', postedFirstName);
    if(this.postedFile) {
      myFormData.append('file', this.postedFile, `avatars_${this.postedFile.name}`);
    }
    if(this.updateProfileForm.value.bioInput) {
      myFormData.append('bio', this.updateProfileForm.value.bioInput);
    }
    
    if(this.updateProfileForm.value.postedCurrentPassword || this.updateProfileForm.value.postedNewPassword1 || this.updateProfileForm.value.postedNewPassword2) {
      console.log('mise à jour du mot de passe demandée');
      if(!this.updateProfileForm.value.postedCurrentPassword || !this.updateProfileForm.value.postedNewPassword1 || !this.updateProfileForm.value.postedNewPassword2) {
        console.log('toutes les valeurs ne sont pas remplies');
        this.notificationService.showError('Pour changer de mot de passe, vous devez remplir tous les champs requis :<br/>- Votre ancien mot de passe<br/>- votre nouveau mot de passe<br/>- Votre nouveau mot de passe une seconde fois', 'Erreur', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
        return;
      }
      else {
        if(this.updateProfileForm.value.postedNewPassword1 !== this.updateProfileForm.value.postedNewPassword2) {
          this.notificationService.showError('Les champs "entrez le nouveau mot de passe" et "Confirmez le nouveau mot de passe" contiennent des valeurs différentes', 'Erreur', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
          return;
        }
        else {
          console.log('valeurs égales');
          const passwordRegexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
          console.log(passwordRegexp.test(this.updateProfileForm.value.postedNewPassword1));
          if(!passwordRegexp.test(this.updateProfileForm.value.postedNewPassword1)) {
            this.notificationService.showError('Le mot de passe demandé n\'est pas valide.<br/>Celui-ci doit contenir :<br/>- Au moins 8 caractères<br/>- Au moins une majuscule<br/>- Au moins une minuscule<br/>- Au moins un chiffre', '',  {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
            return;
          }
          else {
            console.log('Password valide');
            myFormData.append('postedCurrentPassword', postedCurrentPassword);
            myFormData.append('postedNewPassword1', postedNewPassword1);
            myFormData.append('postedNewPassword2', postedNewPassword2);
          }
          
        }
      }
    }

    
    this.userService.updateProfile(myFormData).subscribe({
      next: (data) => {
        let newData = { ...data }
        newData.token = this.tokenStorageService.getToken();

        //////
        // TODO : ne pas sauvegarder l'user dans le localStorage !!
        //////

        this.tokenStorageService.saveUser(newData);
        
        window.location.reload();
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
        if(result.handler == 'confirm')
          console.log('confirmation reçue');
          this.userService.deleteAccount().subscribe({
            next: (data) => {
              console.log(data);
            },
            error: (err) => {
              console.error(err);
              if(err.error.message == 'jwt expired') {
                this.tokenStorageService.signOut();
                window.location.reload();
              }
            }
          })
      }
    })
  }

  deleteAccount(): void {
    console.log('Suppression demandée');
    this.openAccountDeletingDialog();
  }
}
