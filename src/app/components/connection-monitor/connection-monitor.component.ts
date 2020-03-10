import {Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, Subscription, timer} from 'rxjs';
import {delay, retryWhen, switchMap, tap} from 'rxjs/operators';
import {UserSettingsService} from '../../services/user-settings.service';
import {LabPipeService} from '../../services/lab-pipe.service';
import {ShareDataService} from '../../services/share-data.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-connection-monitor',
  templateUrl: './connection-monitor.component.html',
  styleUrls: ['./connection-monitor.component.css']
})
export class ConnectionMonitorComponent implements OnInit, OnDestroy {
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  networkConnectedStateSubscription: Subscription;
  networkDisconnectedStateSubscription: Subscription;
  serverStateSubscription: Subscription;

  networkConnected: boolean;
  serverConnected: boolean;
  url: string;

  constructor(private us: UserSettingsService,
              private tds: ShareDataService,
              private nzMessage: NzMessageService,
              private lps: LabPipeService) {
    this.networkConnected = window.navigator.onLine;
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.monitorNetworkState();
    this.monitorServerState();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.networkConnectedStateSubscription) {
      this.networkConnectedStateSubscription.unsubscribe();
    }
    if (this.networkDisconnectedStateSubscription) {
      this.networkDisconnectedStateSubscription.unsubscribe();
    }
    if (this.serverStateSubscription) {
      this.serverStateSubscription.unsubscribe();
    }
  }

  monitorNetworkState() {
    this.networkConnectedStateSubscription = this.onlineEvent.subscribe(() => {
      this.networkConnected = true;
      console.log('Connected to internet');
      this.monitorServerState();
    });

    this.networkDisconnectedStateSubscription = this.offlineEvent.subscribe(() => {
      this.networkConnected = false;
      console.log('No internet connection');
      this.tds.connected.next(false);
      this.monitorServerState();
    });
  }

  monitorServerState() {
    if (this.us.getApiRoot()) {
    this.serverStateSubscription = timer(0, this.us.getServerMonitorInterval())
        .pipe(
            switchMap(() => this.lps.heartbeat()),
            retryWhen(errors =>
                errors.pipe(
                    tap(() => {
                      this.serverConnected = false;
                      this.tds.connected.next(false);
                      console.log('No server connection');
                    }),
                    delay(this.us.getServerMonitorRetryInterval())
                )
            )
        )
        .subscribe(() => {
          this.serverConnected = true;
          console.log('Connected to server');
          this.tds.connected.next(true);
        });
    }
  }
}
