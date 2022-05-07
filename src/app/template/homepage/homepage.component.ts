//angular modules and services
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';

//app services
import { PostService } from '../../modules/shared/posts/post.service';
import { AuthService } from '../../_services/auth.service';
import { NotificationService } from 'src/app/_services/notification.service';

// interfaces
import { User } from '../../interfaces/user.interface';
import { Post } from '../../interfaces/post.interface';
import { AuthStatus } from '../../interfaces/authStatus.interface';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  postsData!: Array<Post>;
  user!: User | null;
  authStatus!: AuthStatus;

  constructor(private postService: PostService, private authService: AuthService, private notificationService: NotificationService, private router: Router) { 
    
    this.authService.authStatus$.subscribe({
      next: (authStatus:AuthStatus) => {
        this.user = authStatus.user;
      }
    })
  }

  ngOnInit(): void {
    this.getPostsShunk();
    this.postService.postsData$.subscribe({
      next: postsData => {
        this.postsData = postsData;
      }
    })
  }

  getPostsShunk(): void {
    this.postService.getPostShunk(0).pipe(take(1)).subscribe({
      next:data => {
        this.postService.postsDataSource.next(data);
      },
      error: (err) => {
        console.log(err.error.message);
                this.notificationService.showError(err.error.message, 'Erreur !', {closeButton: true, positionClass: 'toast-bottom-center'});
      }
    })
  }
}