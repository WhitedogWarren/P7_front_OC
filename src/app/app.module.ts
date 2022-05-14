import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import {MatDialogModule} from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { errorInterceptorProviders } from './_helpers/error.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './template/header/header.component';

import { HomepageComponent } from './template/homepage/homepage.component';
import { ModeratorDashboardComponent } from './template/moderator-dashboard/moderator-dashboard.component';
import { AccountDeletingDialogComponent } from './modules/routing/users/account-deleting-dialog/account-deleting-dialog.component';

import { PostsModule } from './modules/shared/posts/posts.module';
import { DeletingDialogComponent } from './template/deleting-dialog/deleting-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    ModeratorDashboardComponent,
    AccountDeletingDialogComponent,
    DeletingDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    InfiniteScrollModule,
    PostsModule
  ],
  providers: [authInterceptorProviders, errorInterceptorProviders],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
