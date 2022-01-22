import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-post-maker',
  templateUrl: './post-maker.component.html',
  styleUrls: ['./post-maker.component.scss']
})
export class PostMakerComponent implements OnInit {
  @Input() userId?: any;
  postMakerForm = new FormGroup({
    postedContent: new FormControl('')
  })
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    //console.log(this.userId);
    
  }
  onSubmit(): void {
    console.log(this.postMakerForm.value.postedContent);
    this.authService.createPost(this.userId, this.postMakerForm.value).subscribe(
      data => {
        console.log(data);
      }
      
    )
    window.location.reload();
    
  }

}
