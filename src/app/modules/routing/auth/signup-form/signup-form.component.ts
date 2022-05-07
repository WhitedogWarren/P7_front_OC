//angular modules and services
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';

//app services
import { AuthService } from '../../../../_services/auth.service';
import { NotificationService } from '../../../../_services/notification.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  signupForm = this.formBuilder.group({
    signupLastName: ['', [Validators.required, Validators.minLength(2)]],
    signupFirstName: ['', [Validators.required, Validators.minLength(2)]],
    signupEmail: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
  signupPassword: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\+\-\/\=\!@_&\*]{8,}$')]]
  });
  isSuccessful = false;
  isSignupFailed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';


  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {}

  onSubmit(): void {
    const { signupLastName, signupFirstName, signupEmail, signupPassword } = this.signupForm.value;

    this.authService.signup( signupLastName, signupFirstName, signupEmail, signupPassword).pipe(take(1)).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignupFailed = false;
        this.authService.login(signupEmail, signupPassword).subscribe({
          next: data => {
            if(data.newUser && data.token) {
              window.localStorage.setItem('auth-token', data.token);
              this.authService.saveUser(data.newUser);
            }
            this.isLoginFailed = false;
            this.isLoggedIn = true;
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

  hasLowercase(value:string): Array<string> | null {
    return value.match(/[a-z]/);
  }
  hasUppercase(value:string): Array<string> | null {
    return value.match(/[A-Z]/);
  }
  hasNumber(value:string): Array<string> | null {
    return value.match(/[0-9]/);
  }
  hasEnoughDigits(value:string): boolean | null {
    return value.length >= 8;
  }
  setBGImage(e:Event) {
    let inputElement = e.target as HTMLElement;
    //console.log(inputElement);
    setTimeout(() => {
      inputElement.style.backgroundImage = 'url(./../../../../../assets/images/icons/green_check.png)';
    }, 400);
    
  }
}
