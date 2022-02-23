import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-profile-updater',
  templateUrl: './profile-updater.component.html',
  styleUrls: ['./profile-updater.component.scss']
})
export class ProfileUpdaterComponent implements OnInit {
  @Input() user?: any;
  postedFile!: File;
  updateProfileForm = new FormGroup({
    postedLastName: new FormControl(),
    postedFirstName: new FormControl(),
    avatarInput: new FormControl(null),
    bioInput: new FormControl()
  });
  errorMessage = '';

  constructor(private tokeStorageService: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    let bio: string;
    if(!this.user.userBio) {
      bio = '';
    }
    else {
      bio = this.user.userBio;
    }
    this.updateProfileForm.setValue({postedLastName: this.user.userLastName, postedFirstName: this.user.userFirstName, avatarInput: '', bioInput: bio});
  }

  onSubmit(): void {
    const { postedLastName, postedFirstName } = this.updateProfileForm.value;
    let myFormData = new FormData();
    myFormData.append('userId', this.user.userId);
    myFormData.append('lastname', postedLastName);
    myFormData.append('firstname', postedFirstName);
    if(this.postedFile) {
      myFormData.append('file', this.postedFile, `avatars_${this.postedFile.name}`);
    }
    if(this.updateProfileForm.value.bioInput) {
      myFormData.append('bio', this.updateProfileForm.value.bioInput);
    }
      
    this.userService.updateProfile(myFormData).subscribe({
      next: (data) => {
        let newData = { ...data }
        newData.token = this.tokeStorageService.getToken();
        this.tokeStorageService.saveUser(newData);
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  avatarHandler(event: any) {
    this.postedFile = event.target.files[0];
    document.getElementsByClassName('avatar-image')[0].setAttribute('src', URL.createObjectURL(this.postedFile));
  }
}
