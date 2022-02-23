import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PostService } from '../_services/post.service';


@Component({
  selector: 'app-post-maker',
  templateUrl: './post-maker.component.html',
  styleUrls: ['./post-maker.component.scss']
})
export class PostMakerComponent implements OnInit {
  @Input() userId?: any;
  fileName = '';
  postedFile!:File;
  postMakerForm = new FormGroup({
    postedContent: new FormControl('')
  })
  constructor(private postService: PostService) { }

  ngOnInit(): void {
    
  }
  onSubmit(): void {
    let myFormData = new FormData();
    myFormData.append('postedContent', this.postMakerForm.value.postedContent);
    myFormData.append('userId', this.userId);
    if(this.fileName) {
      console.log('file detecté');
      myFormData.append('file', this.postedFile, `postImage_${this.fileName}`);
    }
    
    this.postService.createPost(myFormData).subscribe(
      data => {
        console.log(data);
      }
    )
    window.location.reload();
  }
  onFileSelected(event: any): void {
    const file:File = event.target.files[0];
    if(file) {
      this.fileName = file.name;
      this.postedFile = file;
    }
  }

}
