import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { NotificationService } from '../_services/notification.service';
import { Router } from '@angular/router';


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

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private notificationService: NotificationService, private router: Router) { }

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
            window.sessionStorage.setItem('auth-token', data.token);
            this.authService.saveUser(data);

            this.isLoginFailed = false;
            this.isLoggedIn = true;
            //this.roles = this.tokenStorage.getUser.roles;
            this.router.navigate(['/homepage']);
          },
          error: err => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
          }
        })
      },
      error: err => {
        let message = '';
        message += 'Formulaire invalide !<br/>';
        console.log(err.error.emptyFields);
        if(err.error.emptyFields) {
          if(err.error.emptyFields.length == 1)
            message += `Le champ ${err.error.emptyFields[0]} est vide.`;
          else {
            message += 'Les champs suivant sont vides :<br/>'
            for(let field of err.error.emptyFields) {
              message += `- ${field}<br/>`;
            }
          }
        }
        if(err.error.invalidFields) {
          message += '<br/>';
          if(err.error.invalidFields.length == 1)
            message += `Le champ ${err.error.invalidFields[0]} est invalide.`;
          else {
            message += 'Les champs suivants sont invalides :<br/>';
            for(let field of err.error.invalidFields) {
              message += `- ${field}<br/>`;
            }
          }
        }
        this.notificationService.showError(message, 'Erreur !', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
        this.errorMessage = err.error.message;
        this.isSignupFailed = true;
      }
    });
  }
}
