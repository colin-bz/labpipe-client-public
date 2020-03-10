import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {ShareDataService} from './share-data.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate{
  operator: any;

  constructor(public tds: ShareDataService, public router: Router) {
    this.tds.operator.subscribe(value => this.operator = value);
  }

  canActivate(): boolean {
    if (!this.operator) {
      this.router.navigate(['user-login']);
      return false;
    }
    if (!this.operator.roles.includes('admin')) {
      this.router.navigate(['/error/no-access']);
      return false;
    }
    return true;
  }
}
