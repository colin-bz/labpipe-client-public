import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserSettingsService} from '../../services/user-settings.service';
import {ElectronService} from 'ngx-electron';
import {TemporaryDataService} from '../../services/temporary-data.service';
import {NzNotificationService} from 'ng-zorro-antd';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  locations$: any[];
  instruments$: any[];
  operators$: any[];

  currentOperator: any;
  loginForm: FormGroup;
  selectedLocation: any;
  selectedInstrument: any;
  appVersion: string;

  confirmLoginDialogOpened = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private nzNotification: NzNotificationService,
              private us: UserSettingsService,
              private es: ElectronService,
              private tds: TemporaryDataService) {
    this.selectedLocation = this.us.getLocation();
    this.selectedInstrument = this.us.getInstrument();
    this.loginForm = this.formBuilder.group({
      location: [this.selectedLocation ? this.selectedLocation : '', Validators.required],
      instrument: [this.selectedInstrument ? this.selectedInstrument : '', Validators.required],
      operator: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.appVersion = this.us.getParameter('version');
    this.locations$ = this.us.getLocations();
    this.instruments$ = this.us.getInstruments();
    this.operators$ = this.us.getOperators();
    this.formChangeListener();
  }

  formChangeListener(): void {
    this.loginForm.valueChanges.subscribe(val => {
      this.selectedLocation = val.location;
      this.selectedInstrument = val.instrument;
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const u = this.loginForm.get('operator').value;
      const p = this.loginForm.get('password').value;
      const valid = this.tryLogin(u, p);
      if (valid) {
        this.confirmLoginDialogOpened = true;
      } else {
        this.loginFail();
      }

    }
  }

  tryLogin(username: string, password: string): boolean {
    username = username.toLowerCase();
    const user = this.operators$.filter(o => o.username.toLowerCase() === username);
    const bcrypt = this.es.remote.require('bcryptjs');
    const result = user.length === 1 && bcrypt.compareSync(password, user[0].passwordHash);
    if (result) {
      this.currentOperator = user[0];
    }
    return result;
  }

  onConfirm(status: boolean) {
    this.confirmLoginDialogOpened = false;
    if (status) {
      this.tds.location = this.loginForm.get('location').value;
      this.us.setLocation(this.loginForm.get('location').value);
      this.tds.instrument = this.loginForm.get('instrument').value;
      this.us.setInstrument(this.loginForm.get('instrument').value);
      this.tds.operator = this.currentOperator;
      this.tds.password = this.loginForm.get('password').value;
      this.router.navigate(['tasks']);
    }
  }

  loginFail() {
    this.nzNotification.create(
        'error',
        'Login unsuccessful',
        'You have entered incorrect user ID or password.'
    );
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.identifier === c2.identifier : c1 === c2;
  }

}
