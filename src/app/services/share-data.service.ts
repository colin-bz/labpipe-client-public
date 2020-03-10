import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  operator: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  password: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  location: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  instrument: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  study: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  resetLogin() {
    this.operator.next(undefined);
    this.password.next(undefined);
    this.location.next(undefined);
    this.instrument.next(undefined);
    this.study.next(undefined);
  }

  resetTask() {
    this.study.next(undefined);
  }
}
