import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileUpdaterComponent } from './profile-updater/profile-updater.component';
import { ProfileViewerComponent } from './profile-viewer/profile-viewer.component';
import { UsersDisplayComponent } from './users-display/users-display.component';

const routes: Routes = [
  { path: '', component: UsersDisplayComponent },
  { path: 'me', component: ProfileUpdaterComponent},
  { path: ':id', component: ProfileViewerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
