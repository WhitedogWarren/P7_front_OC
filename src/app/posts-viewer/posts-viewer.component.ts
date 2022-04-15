import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../interfaces/post.interface';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../_services/auth.service';
import { PostService } from '../_services/post.service';
//import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-posts-viewer',
  templateUrl: './posts-viewer.component.html',
  styleUrls: ['./posts-viewer.component.scss']
})
export class PostsViewerComponent implements OnInit {
  @Input() postsData!: Array<Post>;
  user!: User | null;
  numberOfPosts: number = 10;
  constructor(private authService: AuthService, private postService: PostService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  onScrollDown(event: any): void {
    console.log('scrolled down');

    this.postService.getPostShunk(this.numberOfPosts).subscribe({
      next: data => {
        this.postsData = this.postsData.concat(JSON.parse(data));
        this.numberOfPosts += JSON.parse(data).length;
        //console.log(this.postsData);
      },
      error: (err) => {
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    })
  }
  onScrollUp(event: any): void {
    console.log('scrolled up');
  }
}
