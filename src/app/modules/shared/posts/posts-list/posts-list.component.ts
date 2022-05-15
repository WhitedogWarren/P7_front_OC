//angular modules and services
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';

//app services
import { AuthService } from '../../../../_services/auth.service';
import { PostService } from '../post.service';

//interfaces
import { Post } from '../../../../interfaces/post.interface';
import { User } from '../../../../interfaces/user.interface';


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  @Input() postsData!: Array<Post>;
  user!: User | null;
  numberOfPosts: number = 10;
  constructor(private authService: AuthService, private postService: PostService, private router: Router) {  }

  ngOnInit(): void {
    this.authService.authStatus$.subscribe({
      next: authStatus => {
        this.user = authStatus.user;
      }
    });
  }

  onScrollDown(event: any): void {
    console.log('scrolled down');
    let newData: Array<Post> = [];
    this.postService.getPostShunk(this.numberOfPosts).pipe(take(1)).subscribe({
      next: data => {
        this.postService.postsData$.pipe(take(1)).subscribe({
          next: postData => {
            newData = postData.concat(data);
          }
        })
        this.postService.postsDataSource.next(newData);
        this.numberOfPosts = newData.length;
        this.postsData = newData;
      },
      error: (err) => {
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          this.router.navigate(['auth/login']);
        }
      }
    })
  }
  onScrollUp(event: any): void {
    console.log('scrolled up');
  }
}
