import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../_services/auth.service';

import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-users-display',
  templateUrl: './users-display.component.html',
  styleUrls: ['./users-display.component.scss']
})
export class UsersDisplayComponent implements OnInit {
  user!: User | null;
  userList!: Array<User>;
  adminList!: Array<User>;
  modoList!: Array<User>;
  loading: Boolean = true;
  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    //console.log(this.user);
    this.userService.getUserList().subscribe({
      next: data => {
        this.userList = JSON.parse(data).userList;
        let adminList = [];
        let modoList = [];
        let userList = [];
        for(let i=0; i<this.userList.length; i++) {
          if(this.userList[i].role == 'admin')
            adminList.push(this.userList[i]);
          if(this.userList[i].role == 'moderator') 
            modoList.push(this.userList[i]);
          if(this.userList[i].role == 'user') 
            userList.push(this.userList[i]);
        }
        this.adminList = adminList;
        this.modoList = modoList;
        this.userList = userList;
        this.loading = false;
      },
      error: err => {
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    });
  }
}
