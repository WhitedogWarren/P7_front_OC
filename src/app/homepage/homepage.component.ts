import { Component, Input, OnInit } from '@angular/core';

import { PostService } from '../_services/post.service';
import { User } from '../interfaces/user.interface';
import { Post } from '../interfaces/post.interface';
import { AuthService } from '../_services/auth.service';
import { AuthStatus } from '../interfaces/authStatus.interface';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  postsData!: Array<Post>;
  user!: User | null;
  authStatus!: AuthStatus;

  constructor(private postService: PostService, private authService: AuthService) { 
    
    this.authService.authStatus$.subscribe({
      next: (authStatus:AuthStatus) => {
        console.log('subscribe lancé');
        this.user = authStatus.user;
        /*
        this.authStatus = authStatus;
        this.user = this.authStatus.user;
        */
        console.log('user from homepageComponent :');
        console.log(this.user);
      },
      error: err => {
        console.log(err);
      }
    })
    //this.authService.authStatusSource.next({isLogged: true});
  }

  ngOnInit(): void {
    
    this.getPostsShunk();
    console.log('init');
    this.user = this.authService.getUser();
    console.log(this.user);
    
  }

  getPosts(): void {
    this.postService.getAllPosts().subscribe(data => {
      this.postsData = JSON.parse(data).reverse();
      //console.log(this.postsData);
    });
  }

  getPostsShunk(): void {
    this.postService.getPostShunk(0).subscribe({
      next:data => {
      this.postsData = JSON.parse(data);
      },
      error: (err) => {
        /*
        if(err.error.message == 'jwt expired') {
          this.tokenStorageService.signOut();
          window.location.reload();
        }
        */
      }
    })
  }
}
