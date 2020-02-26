import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from '../../../services/user-settings.service';
import {ElectronService} from 'ngx-electron';
import {FormBuilder} from '@angular/forms';
import {TemporaryDataService} from '../../../services/temporary-data.service';

@Component({
  selector: 'app-task-portal',
  templateUrl: './task-portal.component.html',
  styleUrls: ['./task-portal.component.css']
})
export class TaskPortalComponent implements OnInit {
  location: any;
  instrument: any;
  operator: object;

  constructor(private formBuilder: FormBuilder,
              private es: ElectronService,
              private uss: UserSettingsService,
              private tds: TemporaryDataService) {
    this.operator = this.tds.operator;
    this.location = this.tds.location;
    this.instrument = this.tds.instrument;
  }

  ngOnInit() {
  }

}
