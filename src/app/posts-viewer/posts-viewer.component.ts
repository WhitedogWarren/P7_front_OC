import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts-viewer',
  templateUrl: './posts-viewer.component.html',
  styleUrls: ['./posts-viewer.component.scss']
})
export class PostsViewerComponent implements OnInit {
  @Input() postsData!: any;
  constructor() { }

  ngOnInit(): void {
    //console.log('this.postData (posts-viewer.ts) :');
    //console.log(this.postsData);
  }

  
}
