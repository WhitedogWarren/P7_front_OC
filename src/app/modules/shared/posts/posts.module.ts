import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PostMakerComponent } from './post-maker/post-maker.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { ReactionDialogComponent } from './reaction-dialog/reaction-dialog.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { PostEditorComponent } from './post-editor/post-editor.component';



@NgModule({
  declarations: [
    PostMakerComponent,
    PostsListComponent,
    ReactionDialogComponent,
    SinglePostComponent,
    PostEditorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    InfiniteScrollModule
  ],
  exports: [
    PostMakerComponent,
    PostsListComponent,
    ReactionDialogComponent,
    SinglePostComponent
  ]
})
export class PostsModule { }
