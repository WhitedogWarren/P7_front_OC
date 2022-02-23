import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-users-display',
  templateUrl: './users-display.component.html',
  styleUrls: ['./users-display.component.scss']
})
export class UsersDisplayComponent implements OnInit {
  user!: any;
  userList!: any;
  adminList!: Array<any>;
  modoList!: any;
  loading: Boolean = true;
  constructor(private userService: UserService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    //console.log(this.user);
    this.userService.getUserList().subscribe(data => {
      this.userList = JSON.parse(data).userList;
      let adminList = [];
      let modoList = [];
      let userList = [];
      for(let i=0; i<this.userList.length; i++) {
        //console.log(this.userList[i]);
        if(this.userList[i].role == 'admin') {
          adminList.push(this.userList[i]);
          
        }
        if(this.userList[i].role == 'moderator') {
          modoList.push(this.userList[i]);
          
        }
        if(this.userList[i].role == 'user') {
          userList.push(this.userList[i]);
        }
      }
      this.adminList = adminList;
      this.modoList = modoList;
      this.userList = userList;
      //console.log(this.adminList);
      this.loading = false;
    });
    
  }

}
