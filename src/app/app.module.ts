import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import {MatDialogModule} from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { HomepageComponent } from './homepage/homepage.component';
import { PostMakerComponent } from './post-maker/post-maker.component';
import { PostsViewerComponent } from './posts-viewer/posts-viewer.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { UsersDisplayComponent } from './users-display/users-display.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ProfileUpdaterComponent } from './profile-updater/profile-updater.component';
import { ProfileViewerComponent } from './profile-viewer/profile-viewer.component';
import { UserListItemComponent } from './user-list-item/user-list-item.component';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';
import { ReactionDialogComponent } from './reaction-dialog/reaction-dialog.component';
import { AccountDeletingDialogComponent } from './account-deleting-dialog/account-deleting-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupFormComponent,
    LoginFormComponent,
    HomepageComponent,
    PostMakerComponent,
    PostsViewerComponent,
    SinglePostComponent,
    UsersDisplayComponent,
    UserDashboardComponent,
    ProfileUpdaterComponent,
    ProfileViewerComponent,
    UserListItemComponent,
    ModeratorDashboardComponent,
    ReactionDialogComponent,
    AccountDeletingDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    InfiniteScrollModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
