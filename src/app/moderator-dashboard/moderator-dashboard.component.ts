import { Component, OnInit } from '@angular/core';
import { Post } from '../interfaces/post.interface';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../_services/auth.service';
import { PostService } from '../_services/post.service';


@Component({
  selector: 'app-moderator-dashboard',
  templateUrl: './moderator-dashboard.component.html',
  styleUrls: ['./moderator-dashboard.component.scss']
})
export class ModeratorDashboardComponent implements OnInit {
  moderatedLoading: Boolean = true;
  reportedLoading: Boolean = true;
  user!: User | null;
  moderatedPostsData!: Array<Post>;
  reportedPostsData!: Array<Post>;
  correctedPosts: Array<Post> = [];
  uncorrectedPosts: Array<Post> = [];
  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getPosts();
    this.user = this.authService.getUser();
  }

  getPosts(): void {
    this.postService.getModeratedPosts().subscribe({
        next: data => {
        //console.log(data);
        this.moderatedPostsData = JSON.parse(data).reverse();
        for(let post of this.moderatedPostsData) {
          if(post.corrected)
            this.correctedPosts.push(post);
          else
            this.uncorrectedPosts.push(post);
        }
        this.moderatedLoading = false;
      },
      error: (err) => {
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    })
    this.postService.getReportedPosts().subscribe({
      next: data => {
      //console.log(JSON.parse(data));
      this.reportedPostsData = JSON.parse(data).reverse();
      this.reportedLoading = false;
      },
      error: (err) => {
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    })
  }

  childCalls(): void {
    console.log('fonction appelée');
  }

  
}
