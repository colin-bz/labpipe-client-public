import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {UserSettingsService} from 'src/app/services/user-settings.service';
import {TemporaryDataService} from '../../services/temporary-data.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit, OnChanges {
  @Input() isCollapsed: boolean;
  currentUser: any;

  constructor(private router: Router, private us: UserSettingsService, private tds: TemporaryDataService) {
    this.router.events.subscribe(() => {this.currentUser = this.tds.operator; });
  }

  ngOnInit() {
    this.currentUser = this.tds.operator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isCollapsed = changes.isCollapsed.currentValue;
  }

  reload() {
    this.tds.resetLogin();
    this.router.navigate(['']);
  }

  logout() {
    this.tds.resetLogin();
    this.router.navigate(['login-page']);
  }

  toTasks() {
    this.tds.resetTask();
    this.router.navigate(['tasks']);
  }

  toBrowse() {
    this.tds.resetTask();
    this.router.navigate(['browse']);
  }

  toManage() {
    this.tds.resetTask();
    this.router.navigate(['manage']);
  }

  toProfile() {
    this.tds.resetTask();
    this.router.navigate(['profile']);
  }

  toSettings() {
    this.tds.resetTask();
    this.router.navigate(['settings']);
  }

  toLogin() {
    this.tds.resetLogin();
    this.router.navigate(['login-page']);
  }

  toFreshStartUp() {
    this.tds.resetLogin();
    this.router.navigate(['fresh-startup']);
  }

  onBrandClick() {
    if (this.currentUser) {
      this.toTasks();
    } else {
      if (this.us.getStartupMode()) {
        this.toLogin();
      } else {
        this.toFreshStartUp();
      }
    }
  }

}
