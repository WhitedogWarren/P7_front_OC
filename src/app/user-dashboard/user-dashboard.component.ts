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
viewedUser!: Object;
loading: Boolean = true;

  constructor(private tokenStorageService: TokenStorageService, private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    console.log(`Dashboard perso ? => ${this.personalDashboard}`);
    //////
    // TODO : penser à "tuer" le subscribe
    //////
    this.activatedRoute.params.subscribe((route:any) => { 
      console.log("activatedRoute : " + route.id) ;
      this.personalDashboard = this.user.userId == route.id;
      if(!this.personalDashboard) {
        console.log("user")
        this.userService.getUserInfo(route.id).subscribe(data => {
          this.viewedUser = JSON.parse(data).userInfo;
          console.log('this.viewedUser mis à jour');
          console.log(this.viewedUser);
          this.loading = false;
        })
      }
    });
    
  }

}
