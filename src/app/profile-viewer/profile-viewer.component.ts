import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../_services/auth.service';
import { NotificationService } from '../_services/notification.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-profile-viewer',
  templateUrl: './profile-viewer.component.html',
  styleUrls: ['./profile-viewer.component.scss']
})
export class ProfileViewerComponent implements OnInit {
  @Input() user?: any;
  @Input() viewedUser?:any;
  @Input() loading?: Boolean;
  userRole!: string;
  changeRoleForm = new FormGroup({
    postedNewRole: new FormControl(),
    editedUser: new FormControl()
  })
  constructor(private userService:UserService, private activatedRoute: ActivatedRoute, private notificationService: NotificationService, private authService: AuthService) { 
    //////
    // TODO : récupérer les posts de user.
    //////
  }

  ngOnInit(): void {
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
    //console.log(this.changeRoleForm.value);
    this.userService.changeUserRole(this.changeRoleForm.value).subscribe({
      next: (data) => {
        this.notificationService.showSuccess(JSON.parse(data).message, '', {closeButton: true, enableHtml: true, positionClass: 'toast-bottom-center'});
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
