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
  userLastName?: string;
  userFirstName?: string;
  user?: object;
  //private roles: string[] = [];

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
      this.isLoggedIn = !!this.tokenStorageService.getToken();
      //console.log(this.isLoggedIn);
      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        //this.roles = user.roles;

        //this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.userLastName = user.userLastName;
        this.userFirstName = user.userFirstName;
        this.user = user;
        console.log(user.userId);
      }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
