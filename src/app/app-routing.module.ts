import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UsersDisplayComponent } from './users-display/users-display.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginFormComponent },
  { path: 'signup', component: SignupFormComponent },
  { path: 'homepage', component: HomepageComponent},
  { path: 'users', component: UsersDisplayComponent},
  { path: 'users/:id', component: UserDashboardComponent},
  { path: 'moderatorDashboard', component: ModeratorDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
