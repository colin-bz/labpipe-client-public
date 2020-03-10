import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {UserSettingsService} from 'src/app/services/user-settings.service';
import {ShareDataService} from '../../services/share-data.service';
import {SettingService} from '../../services/setting.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit, OnChanges {
  @Input() isCollapsed: boolean;
  currentUser: any;

  constructor(private router: Router,
              private us: UserSettingsService,
              private ss: SettingService,
              private tds: ShareDataService) {
    this.tds.operator.subscribe(value => this.currentUser = value);
  }

  ngOnInit() {
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
    this.router.navigate(['user-login']);
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
    this.router.navigate(['user-login']);
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
