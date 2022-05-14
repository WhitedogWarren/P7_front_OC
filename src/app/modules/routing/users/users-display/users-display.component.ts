//angular modules and services
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

//app services
import { AuthService } from '../../../../_services/auth.service';
import { UserService } from '../user.service';

//interfaces
import { User } from '../../../../interfaces/user.interface';

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
    this.authService.authStatus$.subscribe({
      next: authStatus => {
        this.user = authStatus.user;
      }
    });
    this.userService.getUserList().pipe(take(1)).subscribe({
      
      next: data => {
        this.userList = data;
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
        
        console.log(this.adminList);
        this.modoList = modoList;
        this.userList = userList;
        this.loading = false;
      }
    });
  }
}