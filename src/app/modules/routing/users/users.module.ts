import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { UsersDisplayComponent } from './users-display/users-display.component';
import { ProfileViewerComponent } from './profile-viewer/profile-viewer.component';
import { UserListItemComponent } from './user-list-item/user-list-item.component';

import { ProfileUpdaterComponent } from './profile-updater/profile-updater.component';
import { PostsModule } from '../../shared/posts/posts.module';


@NgModule({
  declarations: [
    UsersDisplayComponent,
    ProfileViewerComponent,
    ProfileUpdaterComponent,
    UserListItemComponent
    
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    PostsModule
  ]
  
})
export class UsersModule { }
