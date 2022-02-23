import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
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

  constructor(private tokenStorageService: TokenStorageService, private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    if(this.user.userPosts) {
      for(let post of this.user.userPosts) {
        post.User = {
          id: this.user.userId,
          avatarUrl: this.user.userAvatar,
          lastname: this.user.userLastName,
          firstname: this.user.userFirstName
        }
      }
    }
    
    //////
    // TODO : penser à "tuer" le subscribe
    //////
    this.activatedRoute.params.subscribe((route:any) => { 
      this.personalDashboard = this.user.userId == route.id;
      if(!this.personalDashboard) {
        this.userService.getUserInfo(route.id).subscribe(data => {
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
        })
      }
    });
  }
}