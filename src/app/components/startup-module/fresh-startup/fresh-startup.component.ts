import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from '../../../services/user-settings.service';
import {Router} from '@angular/router';
import {ElectronService} from 'ngx-electron';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-fresh-startup',
  templateUrl: './fresh-startup.component.html',
  styleUrls: ['./fresh-startup.component.css']
})
export class FreshStartupComponent implements OnInit {
  isRegularStartup: boolean;

  requireRestartModal: NzModalRef;

  constructor(private us: UserSettingsService,
              private es: ElectronService,
              private nzModal: NzModalService,
              private router: Router) {
  }

  ngOnInit() {
    this.isRegularStartup = this.us.getStartupMode();
    if (this.isRegularStartup && this.us.getDataDirectory() && this.us.getApiToken() && this.us.getApiKey()) {
      this.router.navigate(['prepare-launch']);
    } else {
      this.isRegularStartup = false;
      this.us.setStartupMode(this.isRegularStartup);
    }
  }

  showRequireRestartModal() {
    this.requireRestartModal = this.nzModal.confirm({
      nzTitle: 'LabPipe requires restart',
      nzContent: 'For your settings to take effect, LabPipe will restart itself now.',
      nzOnOk: () => {
        this.us.setStartupMode(this.isRegularStartup);
        this.restart();
      }
    });
  }

  restart() {
    const app = this.es.remote.app;
    app.relaunch();
    app.exit(0);
  }

  continueLaunch() {
    if (this.us.getDataDirectory() && this.us.getApiToken() && this.us.getApiKey()) {
      this.showRequireRestartModal();
    }
  }

}
