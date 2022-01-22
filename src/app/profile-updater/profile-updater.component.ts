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
    avatarInput: new FormControl(null)
  });
  errorMessage = '';

  constructor(private tokeStorageService: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    this.updateProfileForm.setValue({postedLastName: this.user.userLastName, postedFirstName: this.user.userFirstName, avatarInput: ''});
    
  }

  onSubmit() {
    const { postedLastName, postedFirstName } = this.updateProfileForm.value;
    console.log(postedLastName);
    
    let myFormData = new FormData();
    myFormData.append('userId', this.user.userId);
    myFormData.append('lastname', postedLastName);
    myFormData.append('firstname', postedFirstName);
    if(this.postedFile) {
      myFormData.append('avatar', this.postedFile, `avatars_${this.postedFile.name}`);
    }
      
    this.userService.updateProfile(myFormData).subscribe({
      next: (data) => {
        //console.log('data reçues :');
        //console.log(data);
        let newData = { ...data }
        newData.token = this.tokeStorageService.getToken();
        //console.log(newData)
        
        //console.log('data actuelles :');
        //console.log(this.tokeStorageService.getUser());
        
        this.tokeStorageService.saveUser(newData);
        //console.log('data sauvegardées :');
        //console.log(this.tokeStorageService.getUser());
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
      }
    });
    
  }

  avatarHandler(event: any) {
    this.postedFile = event.target.files[0];
    console.log(this.tokeStorageService.getUser());
  }
  
}
