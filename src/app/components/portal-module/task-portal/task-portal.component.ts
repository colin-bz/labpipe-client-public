import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from '../../../services/user-settings.service';
import {ElectronService} from 'ngx-electron';
import {FormBuilder} from '@angular/forms';
import {ShareDataService} from '../../../services/share-data.service';

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
              private tds: ShareDataService) {
    this.tds.operator.subscribe(value => this.operator = value);
    this.tds.location.subscribe(value => this.location = value);
    this.tds.instrument.subscribe(value => this.instrument = value);
  }

  ngOnInit() {
  }

}
