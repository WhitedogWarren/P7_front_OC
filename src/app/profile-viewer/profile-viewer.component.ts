import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-profile-viewer',
  templateUrl: './profile-viewer.component.html',
  styleUrls: ['./profile-viewer.component.scss']
})
export class ProfileViewerComponent implements OnInit {
  @Input() User?: any;
  @Input() viewedUser?:any;
  @Input() loading?: Boolean;
  constructor(private userService:UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
  }
  

}
