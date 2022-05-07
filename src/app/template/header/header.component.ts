//angular modules and services
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

//app services
import { AuthService } from '../../_services/auth.service';
import { HamburgerMenuService } from 'src/app/_services/hamburger-menu.service';

//interfaces
import { AuthStatus } from '../../interfaces/authStatus.interface';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  authStatus!: AuthStatus;
  @Input() isShrinked!: boolean;
  hamburgerDisplayed: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private hamburgerMenuService: HamburgerMenuService) {
    this.authService.authStatus$.subscribe((authStatus:AuthStatus) => {
      this.authStatus = authStatus;
    })
    this.hamburgerMenuService.hamburgerMenu$.subscribe(data => {
      if(data) {
        this.hamburgerDisplayed = false;
      }
    })
  }

  public displayHamburgerMenu(): void {
    this.hamburgerDisplayed = true;
    console.log('ouverture demandée');
  }
  
  /*
  public hideHamburgerMenu(event: Event): void {
    let targetElement = event.target as Element;
    console.log(targetElement);
    console.log(targetElement.classList.contains('hamburger-links'));
    this.hamburgerDisplayed = false;
    console.log('fermeture demandée');
  }
  */

  public logout(): void {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}