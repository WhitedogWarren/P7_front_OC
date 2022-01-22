import { Component, OnInit } from '@angular/core';
import { UserService  } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  userLastName!: string;
  userId!: string;
  postsData!: any;
  constructor(private userService: UserService, private tokenStorageServie: TokenStorageService) { }

  ngOnInit(): void {
    this.getPosts();
    this.userLastName = this.tokenStorageServie.getUser().userLastName;
    this.userId = this.tokenStorageServie.getUser().userId;
    if(!this.userLastName) {
      window.location.href = '/';
    }
  }

  getPosts(): void {
    this.userService.getHomepageContent().subscribe(data => {
      this.postsData = JSON.parse(data).reverse();
      //console.log(this.postsData);
    });
  }

  

}
