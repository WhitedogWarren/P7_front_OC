import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'groupomania';
  isLoggedIn = false;
  user?: object;
  //private roles: string[] = [];

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
      this.isLoggedIn = !!this.tokenStorageService.getToken();
      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        //this.roles = user.roles;

        //this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.user = user;
      }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
