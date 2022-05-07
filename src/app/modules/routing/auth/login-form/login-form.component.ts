//angular modules & services
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';

//app services
import { AuthService } from '../../../../_services/auth.service';
import { NotificationService } from '../../../../_services/notification.service';
import { HamburgerMenuService } from 'src/app/_services/hamburger-menu.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loginForm = this.formBuilder.group({
    loginEmail: ['', [Validators.required, Validators.email]],
    loginPassword: ['', [Validators.required, Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$')]]
  });
  errorMessage = '';
  
  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router, private formBuilder: FormBuilder, private hamburgerMenuService: HamburgerMenuService, private activatedRoute: ActivatedRoute) { 
    this.hamburgerMenuService.hamburgerMenuCloserSource.next(false);
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params['error']);
      if(params['error'] == 'jwt') {
        console.log('testé');
        this.authService.signOut();
      }
    });

   }

  onSubmit(): void {
    const { loginEmail, loginPassword } = this.loginForm.value;
    
    this.authService.login(loginEmail, loginPassword).pipe(take(1)).subscribe({
      next: data => {
        if(data.token && data.newUser) {
          window.localStorage.setItem('auth-token', data.token);
          delete data.token;
          this.authService.authStatusSource.next({isLogged: true, user: data.newUser});
          this.router.navigate(['/homepage']);
        }
      },
      error: err => {
        console.log(err.error.message);
        this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
        this.errorMessage = err.error.message;
      }
    });
  }
}