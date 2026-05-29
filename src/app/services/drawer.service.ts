import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  
  private isOpenedSubject = new BehaviorSubject<boolean>(false);
  isOpened$ = this.isOpenedSubject.asObservable();

  constructor() {}

  toggle() {
    this.isOpenedSubject.next(!this.isOpenedSubject.value);
  }

  open() {
    this.isOpenedSubject.next(true);
  }

  close() {
    this.isOpenedSubject.next(false);
  }


}

