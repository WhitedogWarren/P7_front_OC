import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../_services/auth.service';

import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
user!: any;
personalDashboard!: Boolean;
viewedUser!: any;
loading: Boolean = true;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if(this.user.posts) {
      for(let post of this.user.posts) {
        post.User = {
          id: this.user.id,
          avatarUrl: this.user.avatarUrl,
          lastname: this.user.lastname,
          firstname: this.user.firstname
        }
      }
    }
    
    //////
    // TODO : penser à "tuer" le subscribe
    //////
    this.activatedRoute.params.subscribe((route:any) => { 
      this.personalDashboard = this.user.id == route.id;
      if(!this.personalDashboard) {
        this.userService.getUserInfo(route.id).subscribe({
          next: data => {
            this.viewedUser = JSON.parse(data).userInfo;

            if(this.viewedUser.role == "admin")
              this.viewedUser.roleTranslated = "Adminitrateur";
            if(this.viewedUser.role == "moderator")
              this.viewedUser.roleTranslated = "Modérateur";
            if(this.viewedUser.role == "user")
              this.viewedUser.roleTranslated = "Utilisateur";

            for(let post of this.viewedUser.posts) {
              post.User = {};
              post.User.id = this.viewedUser.id;
              post.User.avatarUrl = this.viewedUser.avatar;
              post.User.lastname = this.viewedUser.lastname;
              post.User.firstname = this.viewedUser.firstname;
              
            }
            this.loading = false;
          },
          error: err => {
            if(err.error.message == 'jwt expired') {
              this.authService.signOut();
              window.location.reload();
            }
          }
        })
      }
    });
  }
}