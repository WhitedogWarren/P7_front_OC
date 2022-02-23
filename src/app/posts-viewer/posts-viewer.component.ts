import { Component, Input, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-posts-viewer',
  templateUrl: './posts-viewer.component.html',
  styleUrls: ['./posts-viewer.component.scss']
})
export class PostsViewerComponent implements OnInit {
  @Input() postsData!: any;
  @Input() userId!: any;
  user!: any;
  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
  }

  
}
