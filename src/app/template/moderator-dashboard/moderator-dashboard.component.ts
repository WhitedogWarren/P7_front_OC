//angular modules and services
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';

//app services
import { AuthService } from '../../_services/auth.service';
import { PostService } from '../../modules/shared/posts/post.service';

//interfaces
import { Post } from '../../interfaces/post.interface';
import { User } from '../../interfaces/user.interface';
import { NotificationService } from 'src/app/_services/notification.service';


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
  reportedPosts!: Array<Post>;
  correctedPosts: Array<Post> = [];
  uncorrectedPosts: Array<Post> = [];
  constructor(private postService: PostService, private authService: AuthService, private notificationService: NotificationService, private router : Router) { }

  ngOnInit(): void {
    this.getPosts();
    this.authService.authStatus$.subscribe({
      next: authStatus => {
        this.user = authStatus.user;
      }
    });
    this.postService.postsData$.subscribe({
      next: data => {
        let newCorrectedPosts: Array<Post> = [];
        let newUncorrectedPosts: Array<Post> = [];
        let newReportedPosts: Array<Post> = [];
        for(let post of data) {
          if(post.corrected) {
            newCorrectedPosts.push(post);
          }
          if(post.moderated && !post.corrected) {
            newUncorrectedPosts.push(post);
          }
          if(post.reported.length > 0) {
            newReportedPosts.push(post);
          }
        }
        this.correctedPosts = newCorrectedPosts;
        this.uncorrectedPosts = newUncorrectedPosts;
        this.reportedPosts = newReportedPosts;
      }
    })
  }

  getPosts(): void {
    let dashboardPostData: Array<Post> = [];
    this.postService.getModeratedPosts().pipe(take(1)).subscribe({
        next: data => {
        this.moderatedPostsData = data.reverse();
        for(let post of this.moderatedPostsData) {
          dashboardPostData.push(post);
          if(post.corrected) {
            this.correctedPosts.push(post);
          }
          else {
            this.uncorrectedPosts.push(post);
          }
        }
        this.moderatedLoading = false;
        if(!this.reportedLoading) {
          this.postService.postsDataSource.next(dashboardPostData);
        }
      },
      error: (err) => {
        console.log(err.error.message);
                this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    })
    this.postService.getReportedPosts().subscribe({
      next: data => {
      this.reportedPosts = data.reverse();
      this.reportedLoading = false;
      for(let post of this.reportedPosts) {
        dashboardPostData.push(post);
      }
      if(!this.moderatedLoading) {
        this.postService.postsDataSource.next(dashboardPostData);
      }
      },
      error: (err) => {
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          this.router.navigate(['auth/login']);
        }
      }
    })
  }
}