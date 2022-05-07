//angular modules and services
import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//app services
import { AuthService } from './_services/auth.service';
import { ScrollService } from './_services/scroll.service';
import { HamburgerMenuService } from './_services/hamburger-menu.service';

//interfaces
import { User } from './interfaces/user.interface';
import { AuthStatus } from './interfaces/authStatus.interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  scrollListener!:any;
  clickListener!:any;
  mouseOverListener!: any;
  isShrinked: boolean = false;
  title:string = 'groupomania';
  user!: User | null;

  
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private renderer2: Renderer2, private scrollService: ScrollService, private hamburgerMenuService: HamburgerMenuService) {
    if (window.localStorage.getItem('auth-token')) {
      this.authService.authStatus$.subscribe((authStatus: AuthStatus) => {
        this.user = authStatus.user;
      })
      this.router.navigate(['/homepage']);
    }
    else {
      this.authService.authStatusSource.next({isLogged: false, user: null})
      this.router.navigate(['/auth/login']);
    }
    this.scrollListener = this.renderer2.listen('document', 'scroll', () => {
      this.scrollService.scrollSource.next(window.scrollY);
    });
    this.clickListener = this.renderer2.listen('document', 'click', (e: Event) => {
      let targetElement = e.target as Element;
      if(targetElement.id !== 'hamburger-menu' && targetElement.id !== 'hamburger-button') {
        this.hamburgerMenuService.hamburgerMenuCloserSource.next(true);
      }
    })
    this.mouseOverListener = this.renderer2.listen('document', 'mouseover', (event: Event) => {
      let targetElement = event.target as Element;
      if(!targetElement.className.includes('hamburger-keeper-items')) {
        this.hamburgerMenuService.hamburgerMenuCloserSource.next(true);
      }
    })
    this.scrollService.scrollValue$.subscribe((scrollValue: number) => {
      let isLocationAuth = window.location.href.includes('auth');
      if(scrollY > 10 && !isLocationAuth) {
        this.isShrinked = true;
      }
      if(scrollY < 10 && !isLocationAuth) {
        this.isShrinked = false;
      }
      this.hamburgerMenuService.hamburgerMenuCloserSource.next(true);
    })
    this.router.events.subscribe((route: any) => {
      if(route.url && route.url == '/auth/login') {
        window.scroll({top: 0});
        this.isShrinked = false;
      }
    })
  }

  logout(): void {
    this.authService.signOut();
    window.location.reload();
  }
}   