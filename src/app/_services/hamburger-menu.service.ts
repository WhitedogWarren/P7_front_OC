import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HamburgerMenuService {

  constructor() { }

  public hamburgerMenuCloserSource = new Subject<boolean>();
  public hamburgerMenu$ = this.hamburgerMenuCloserSource.asObservable();
}
