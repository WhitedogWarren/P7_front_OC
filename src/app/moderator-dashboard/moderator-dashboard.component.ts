import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-moderator-dashboard',
  templateUrl: './moderator-dashboard.component.html',
  styleUrls: ['./moderator-dashboard.component.scss']
})
export class ModeratorDashboardComponent implements OnInit {
  moderatedLoading: Boolean = true;
  reportedLoading: Boolean = true;
  user!: any;
  moderatedPostsData!: any;
  reportedPostsData!: any;
  correctedPosts: any = [];
  uncorrectedPosts: any = [];
  constructor(private postService: PostService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.getPosts();
    this.user = this.tokenStorageService.getUser();
    //console.log(this.user);
  }

  getPosts(): void {
    this.postService.getModeratedPosts().subscribe(data => {
      //console.log(data);
      this.moderatedPostsData = JSON.parse(data).reverse();
      for(let post of this.moderatedPostsData) {
        if(post.corrected)
          this.correctedPosts.push(post);
        else
          this.uncorrectedPosts.push(post);
      }
      //console.log(this.correctedPosts);
      //console.log(this.uncorrectedPosts);

      this.moderatedLoading = false;
    })
    this.postService.getReportedPosts().subscribe(data => {
      console.log(JSON.parse(data));
      this.reportedPostsData = JSON.parse(data).reverse();
      this.reportedLoading = false;
    })
  }
}
