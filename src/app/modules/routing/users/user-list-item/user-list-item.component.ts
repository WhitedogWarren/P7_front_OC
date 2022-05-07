import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent {
  @Input() user!:User;
  constructor() { }

}
