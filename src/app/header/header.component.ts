import { Component, OnInit, Input } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() userLastName?: string;
  @Input() userFirstName?: string;
  @Input() user?: any;
  @Input() isLoggedIn?: boolean;
  
  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    //console.log(this.isLoggedIn);
    //console.log('userLastName : ' + this.userLastName);
    
    if(this.user)
      console.log('userId : ' + this.user.userId);
    
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
