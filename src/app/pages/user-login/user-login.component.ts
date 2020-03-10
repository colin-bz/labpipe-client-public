import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserSettingsService} from '../../services/user-settings.service';
import {ElectronService} from 'ngx-electron';
import {ShareDataService} from '../../services/share-data.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';


@Component({
  selector: 'app-login-page',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit {
  locations$: any[];
  instruments$: any[];
  operators$: any[];

  currentOperator: any;
  loginForm: FormGroup;
  selectedLocation: any;
  selectedInstrument: any;
  appVersion: string;

  confirmLoginModal: NzModalRef;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private nzNotification: NzNotificationService,
              private nzModal: NzModalService,
              private us: UserSettingsService,
              private es: ElectronService,
              private tds: ShareDataService) {
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

  showConfirmModal(modalContent: TemplateRef<{}>) {
    this.confirmLoginModal = this.nzModal.create({
      nzTitle: 'Please review your login information',
      nzContent: modalContent,
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => this.onConfirm(true),
      nzOnCancel: () => this.onConfirm(false)
    });
  }

  onSubmit(modalContent: TemplateRef<{}>) {
    if (this.loginForm.valid) {
      const u = this.loginForm.get('operator').value;
      const p = this.loginForm.get('password').value;
      const valid = this.tryLogin(u, p);
      if (valid) {
        this.showConfirmModal(modalContent);
      } else {
        this.loginFail();
      }
    }
  }

  onConfirm(status: boolean) {
    this.confirmLoginModal.destroy();
    if (status) {
      this.tds.location.next(this.loginForm.get('location').value);
      this.us.setLocation(this.loginForm.get('location').value);
      this.tds.instrument.next(this.loginForm.get('instrument').value);
      this.us.setInstrument(this.loginForm.get('instrument').value);
      this.tds.operator.next(this.currentOperator);
      this.tds.password.next(this.loginForm.get('password').value);
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
