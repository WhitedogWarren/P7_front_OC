import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { NotificationService } from '../_services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm = new FormGroup({
    loginEmail: new FormControl(''),
    loginPassword: new FormControl('')
  });
  //@Input() isLoggedIn!:boolean;
  errorMessage = '';
  
  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    const { loginEmail, loginPassword } = this.loginForm.value;
    
    this.authService.login(loginEmail, loginPassword).subscribe({
      next: data => {
        window.sessionStorage.setItem('auth-token', data.token);
        delete data.token;
        this.authService.authStatusSource.next({isLogged: true, user: data});
        //console.log(this.authService.authStatus$);
        this.router.navigate(['/homepage']);
      },
      error: err => {
        console.log(err.error.message);
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
        this.errorMessage = err.error.message;
        
      }
    });
  }
}