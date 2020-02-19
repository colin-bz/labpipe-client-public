import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {TemporaryDataService} from './temporary-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public tds: TemporaryDataService, public router: Router) {}

  canActivate(): boolean {
    if (!this.tds.operator) {
      this.router.navigate(['login-page']);
      return false;
    }
    return true;
  }
}
