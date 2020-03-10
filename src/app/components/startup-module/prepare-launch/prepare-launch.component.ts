import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from '../../../services/user-settings.service';
import {Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {forkJoin} from 'rxjs';
import {LabPipeService} from '../../../services/lab-pipe.service';
import {SettingService} from '../../../services/setting.service';

@Component({
  selector: 'app-prepare-launch',
  templateUrl: './prepare-launch.component.html',
  styleUrls: ['./prepare-launch.component.css']
})
export class PrepareLaunchComponent implements OnInit {

  parameterList: string[] = [];

  constructor(private lps: LabPipeService, private us: UserSettingsService,
              private ds: DatabaseService,
              private ss: SettingService,
              private router: Router) {
  }

  ngOnInit() {
    const component = this;
    this.loadParameterList().subscribe(
      (data: any) => {
        console.log('init parameter list retrieved');
        console.log(data);
        this.parameterList = data.find(param => param.identifier === 'client_init').value;
      },
      error => {
        console.warn('error loading init parameter list');
      },
      () => {
        const observableList = this.parameterList.map(paramName => component.lps.getParameter(paramName));
        forkJoin(observableList).subscribe(
          (data: any[]) => {
            data.forEach((param, index) => {
              console.log(param);
              console.log('loading parameter ' + component.parameterList[index]);
              component.us.setParameter(String(component.parameterList[index]), param);
              component.ss.setSetting(String(component.parameterList[index]), param);

            });
          },
          error => {
            console.log(error);
          },
          () => {
            this.router.navigate(['user-login']);
          }
        );
      });
  }

  loadParameterList() {
    return this.lps.getParameter('CLIENT_SETTINGS');
  }

}
