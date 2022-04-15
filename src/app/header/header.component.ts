import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStatus } from '../interfaces/authStatus.interface';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authStatus!: AuthStatus;
  
  
  constructor(private authService: AuthService, private router: Router) {
    this.authService.authStatus$.subscribe((authStatus:AuthStatus) => {
      this.authStatus = authStatus;
    })
  }

  ngOnInit(): void {
    
  }

  logout(): void {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

}
