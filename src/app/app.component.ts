import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { AuthService } from './_services/auth.service';
import { User } from './interfaces/user.interface';
import { Router } from '@angular/router';
import { AuthStatus } from './interfaces/authStatus.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(/*private tokenStorageService: TokenStorageService, */ private authService: AuthService, private router: Router) {
    authService.authStatus$.subscribe((authStatus) => {
      
      this.user = authStatus.user;
      console.log(this.user);
      
    })
  }

  title = 'groupomania';
  user!: User | null;
  
  ngOnInit(): void {
    console.log(window.sessionStorage.getItem('auth-token'));
    if (window.sessionStorage.getItem('auth-token')) {
      this.authService.authStatus$.subscribe((authStatus: AuthStatus) => {
        console.log(authStatus);
        this.user = authStatus.user;
      })
      console.log(this.user);
      this.router.navigate(['/homepage']);
    }
    else {
      console.log('perdu');
      this.authService.authStatusSource.next({isLogged: false, user: null})
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.signOut();
    window.location.reload();
  }
}
