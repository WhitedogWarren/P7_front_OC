import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './template/homepage/homepage.component';
import { ModeratorDashboardComponent } from './template/moderator-dashboard/moderator-dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'homepage', component: HomepageComponent},
  { path: 'moderatorDashboard', component: ModeratorDashboardComponent},
  { path: 'auth', loadChildren: () => import('./modules/routing/auth/auth.module').then(m => m.AuthModule) },
  { path: 'users', loadChildren: () => import('./modules/routing/users/users.module').then(m => m.UsersModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }