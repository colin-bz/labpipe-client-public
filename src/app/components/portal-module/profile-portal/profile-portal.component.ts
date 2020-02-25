import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from '../../../services/user-settings.service';
import {TemporaryDataService} from '../../../services/temporary-data.service';
import {Operator} from '../../../models/parameter.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LabPipeService} from '../../../services/lab-pipe.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-profile-portal',
  templateUrl: './profile-portal.component.html',
  styleUrls: ['./profile-portal.component.css']
})
export class ProfilePortalComponent implements OnInit {
  operator: Operator;

  showModal = {
    changePassword: false
  };

  changePasswordForm: FormGroup;

  constructor(private uss: UserSettingsService,
              private tds: TemporaryDataService,
              private lps: LabPipeService,
              private nzNotification: NzNotificationService,
              private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      current: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.operator = this.tds.operator;
  }

  changePassword() {
    this.lps.updatePassword(this.changePasswordForm.get('confirm').value).subscribe((data: any) => {
      this.tds.password = this.changePasswordForm.get('confirm').value;
      this.nzNotification.success('Success', data.message);
      },
      (error: any) => {
        this.nzNotification.error('Error', error.error.message);
      },
      () => this.showModal.changePassword = false);
  }

onConfirm(target: string,   confirm: boolean, form: FormGroup) {
  switch (target) {
    case 'change-password':
      if (confirm) {
        this.changePassword();
      } else {
        form.reset();
      }
      this.showModal.changePassword = false;
      break;
  }
}

}
