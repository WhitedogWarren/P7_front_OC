import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { PostService } from '../_services/post.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  userLastName!: string;
  userId!: string;
  user!: any;
  postsData!: any;
  constructor(private postService: PostService, private tokenStorageServie: TokenStorageService) { }

  ngOnInit(): void {
    this.getPosts();
    this.userLastName = this.tokenStorageServie.getUser().userLastName;
    this.userId = this.tokenStorageServie.getUser().userId;
    this.user = this.tokenStorageServie.getUser();
    if(!this.userLastName) {
      window.location.href = '/';
    }
  }

  getPosts(): void {
    this.postService.getAllPosts().subscribe(data => {
      this.postsData = JSON.parse(data).reverse();
      //console.log(this.postsData);
    });
  }

  

}
