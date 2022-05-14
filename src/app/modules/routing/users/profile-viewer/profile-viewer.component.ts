//angular modules and services
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

//app services
import { AuthService } from '../../../../_services/auth.service';
import { NotificationService } from '../../../../_services/notification.service';
import { UserService } from '../user.service';

//interfaces
import { User } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-profile-viewer',
  templateUrl: './profile-viewer.component.html',
  styleUrls: ['./profile-viewer.component.scss']
})
export class ProfileViewerComponent {
  user!: User | null;
  loading: boolean = true;
  viewedUser!: User;
  userRole!: string;
  changeRoleForm = new FormGroup({
    postedNewRole: new FormControl(),
    editedUser: new FormControl()
  })
  constructor(private userService:UserService, private activatedRoute: ActivatedRoute, private notificationService: NotificationService, private authService: AuthService) { 
    this.authService.authStatus$.subscribe({
      next: authStatus => {
        this.user = authStatus.user;
      }
    });
    this.activatedRoute.params.subscribe((route) => {
      this.userService.getUserInfo(route['id']).subscribe({
        next: viewedUser => {
          console.log(viewedUser);
          console.log(this.user);
          this.viewedUser = viewedUser;
          if(viewedUser.posts) {
            for(let post of viewedUser.posts) {
              post.User = this.viewedUser;
            }
          }
          
          this.changeRoleForm.patchValue({postedNewRole: this.viewedUser.role, editedUser: this.viewedUser.id});
          this.loading = false;
        }
      });
    })
  }

  ngOnChanges(): void {
    if(this.viewedUser) {
      this.changeRoleForm.patchValue({
        postedNewRole: this.viewedUser.role,
        editedUser: this.viewedUser.id
      });
    }
  }
  
  onChangeRoleSubmit(): void {
    console.log(this.changeRoleForm.value);
    this.userService.changeUserRole(this.changeRoleForm.value).pipe(take(1)).subscribe({
      next: (data) => {
        this.notificationService.showSuccess(data.message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
        if(data.newUser) {
          this.viewedUser = data.newUser;
        }
      },
      error: (err) => {
        console.log(err);
        if(err.error.message == 'jwt expired') {
          this.authService.signOut();
          window.location.reload();
        }
      }
    });
  }
}