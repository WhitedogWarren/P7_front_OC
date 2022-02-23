import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private userService:UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //console.log(this.user);
  }

  ngOnChanges(): void {
    if(this.viewedUser) {
      //console.log(this.viewedUser);
      this.changeRoleForm.patchValue({
        postedNewRole: this.viewedUser.role,
        editedUser: this.viewedUser.id
      });
    }
    //this.loading = false;
      
  }
  
  onChangeRoleSubmit(): void {
    //console.log(this.changeRoleForm.value);
    this.userService.changeUserRole(this.changeRoleForm.value).subscribe({
      next: (data) => {
        //console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onRoleChange(): void {
    //console.log(this.changeRoleForm.value);
  }

}
