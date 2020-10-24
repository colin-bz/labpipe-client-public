import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {UserSettingsService} from '../../../services/user-settings.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-setting-portal',
  templateUrl: './setting-portal.component.html',
  styleUrls: ['./setting-portal.component.css']
})
export class SettingPortalComponent implements OnInit {


  appCachePath: string;

  clearCacheModal: NzModalRef;
  @ViewChild('clearCacheModalContent') public clearCacheModalContent: TemplateRef<any>;

  constructor(private us: UserSettingsService,
              private nzModal: NzModalService,
              private es: ElectronService) {
  }

  ngOnInit() {
    const app = this.es.remote.app;
    const path = this.es.remote.require('path');
    this.appCachePath = path.join(app.getPath('appData'), app.name);
    console.log(app.getAppPath());
  }

  showDevTools() {
    this.es.remote.getCurrentWebContents().openDevTools();
  }

  showClearCacheModal() {
    this.clearCacheModal = this.nzModal.warning({
      nzTitle: 'You are about to delete all cache content!',
      nzContent: this.clearCacheModalContent,
      nzFooter: [
        {
          label: 'Cancel',
          shape: 'default',
          onClick: () => this.clearCacheModal.destroy()
        },
        {
          label: 'Contitue',
          shape: 'danger',
          onClick: this.clearCache
        }
      ]
    });
  }

  clearCache() {
    this.clearCacheModal.destroy();
    const fs = this.es.remote.require('fs-extra');
    fs.remove(this.appCachePath, () => {
      // callback
      this.nzModal.info({
        nzTitle: 'LabPipe will restart.',
        nzOnOk: this.restart
      });
    });
  }

  restart() {
    const app = this.es.remote.app;
    app.relaunch();
    app.exit(0);
  }

}
