import { Component, OnInit, Input } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user?: any;
  @Input() isLoggedIn?: boolean;
  
  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
