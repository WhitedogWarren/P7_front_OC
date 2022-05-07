import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  public scrollSource = new BehaviorSubject<number>(0);
  public scrollValue$ = this.scrollSource.asObservable();
}
