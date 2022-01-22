import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  signupForm = new FormGroup({
    signupLastName: new FormControl(''),
    signupFirstName: new FormControl(''),
    signupEmail: new FormControl(''),
    signupPassword: new FormControl('')
  });
  isSuccessful = false;
  isSignupFailed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {}

  onSubmit() {
    const { signupLastName, signupFirstName, signupEmail, signupPassword } = this.signupForm.value;
    //console.log(signupLastName);

    this.authService.signup( signupLastName, signupFirstName, signupEmail, signupPassword).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignupFailed = false;
        this.authService.login(signupEmail, signupPassword).subscribe({
          next: data => {
            this.tokenStorage.saveToken(data.token);
            this.tokenStorage.saveUser(data);

            this.isLoginFailed = false;
            this.isLoggedIn = true;
            //this.roles = this.tokenStorage.getUser.roles;
            window.location.href = '/homepage';
          },
          error: err => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
          }
        })
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignupFailed = true;
      }
    });
  }
}
