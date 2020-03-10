import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UserSettingsService} from '../../../services/user-settings.service';
import {ShareDataService} from '../../../services/share-data.service';
import {Operator} from '../../../models/parameter.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LabPipeService} from '../../../services/lab-pipe.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-profile-portal',
  templateUrl: './profile-portal.component.html',
  styleUrls: ['./profile-portal.component.css']
})
export class ProfilePortalComponent implements OnInit {
  operator: Operator;

  changePasswordForm: FormGroup;
  changePasswordModal: NzModalRef;
  @ViewChild('changePasswordModalContent', {static: false}) public changePasswordModalContent: TemplateRef<any>;

  constructor(private uss: UserSettingsService,
              private tds: ShareDataService,
              private lps: LabPipeService,
              private nzModal: NzModalService,
              private nzNotification: NzNotificationService,
              private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      current: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirm: ['', Validators.required]
    });
    this.tds.operator.subscribe(value => this.operator = value);
  }

  ngOnInit() {
  }

  showChangePasswordModal() {
    this.changePasswordModal = this.nzModal.warning({
      nzTitle: 'Change your password',
      nzContent: this.changePasswordModalContent,
      nzFooter: [
        {
          label: 'Back',
          shape: 'default',
          onClick: this.destroyChangePasswordModal
        }],
    });
  }

  destroyChangePasswordModal() {
    this.changePasswordModal.destroy();
    this.changePasswordForm.reset();
  }

  changePassword() {
    if (this.changePasswordForm.get('newPassword').value !== this.changePasswordForm.get('confirm').value) {
      this.nzNotification.error('Error', 'Your new password does not match.');
    } else {
      this.lps.updatePassword(this.changePasswordForm.get('confirm').value).subscribe((data: any) => {
          this.tds.password.next(this.changePasswordForm.get('confirm').value);
          this.nzNotification.success('Success', data.message);
        },
        (error: any) => {
          this.nzNotification.error('Error', error.error.message);
        },
        () => this.destroyChangePasswordModal);
    }
  }

}
