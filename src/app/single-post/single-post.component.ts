import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  @Input() post!:any;
  @Input() user!: any;
  constructor() { }

  ngOnInit(): void {
  }

}
