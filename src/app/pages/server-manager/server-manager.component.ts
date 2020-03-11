import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LabPipeService} from '../../services/lab-pipe.service';
import {CollectionName, EmailGroup, FormTemplate, Operator, Role, Study} from '../../models/parameter.model';
import {NzNotificationService} from 'ng-zorro-antd';
import {ShareDataService} from '../../services/share-data.service';

@Component({
  selector: 'app-manage-portal',
  templateUrl: './server-manager.component.html',
  styleUrls: ['./server-manager.component.css']
})
export class ServerManagerComponent implements OnInit {

  connected: boolean;

  showModal = {
    newOperator: false,
    newToken: false,
    newRole: false,
    newStudy: false,
    newLocation: false,
    newInstrument: false,
    newEmailGroup: false,
    newFormTemplate: false,
    newReportTemplate: false
  };
  operatorForm: FormGroup;
  studyForm: FormGroup;
  roleForm: FormGroup;
  locationForm: FormGroup;
  instrumentForm: FormGroup;
  emailGroupForm: FormGroup;
  formTemplateForm: FormGroup;
  reportTemplateForm: FormGroup;

  studies: Study[] = [];
  roles: Role[] = [];
  notificationGroups: EmailGroup[] = [];
  operators: Operator[] = [];
  formTemplates: FormTemplate[] = [];

  loadingEmailGroup: boolean;

  constructor(private formBuilder: FormBuilder,
              private lps: LabPipeService,
              private sds: ShareDataService,
              private nzNotification: NzNotificationService) {
    this.sds.connected.subscribe(value => this.connected = value);
    this.operatorForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      projects: [[]],
      roles: [[]],
      notificationGroup: [[]]
    });
    this.roleForm = this.formBuilder.group({
      identifier: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.studyForm = this.formBuilder.group({
      identifier: ['', Validators.required],
      name: ['', Validators.required],
      config: ['', Validators.required]
    });
    this.locationForm = this.formBuilder.group({
      identifier: ['', Validators.required],
      name: ['', Validators.required],
      type: [[]]
    });
    this.instrumentForm = this.formBuilder.group({
      identifier: ['', Validators.required],
      name: ['', Validators.required],
      realtime: [false, Validators.required],
      fileType: [[]]
    });
    this.emailGroupForm = this.formBuilder.group({
      identifier: ['', Validators.required],
      name: ['', Validators.required],
      formIdentifier: ['', Validators.required],
      studyIdentifier: [''],
      admin: [[]],
      member: [[]]
    });
  }

  ngOnInit() {
  }

  addNewRecord(target: string) {
    switch (target) {
      case 'operator':
        this.showModal.newOperator = true;
        this.lps.getParameter(CollectionName.STUDIES, true).subscribe(
          (data: Study[]) => this.studies = data
        );
        this.lps.getParameter(CollectionName.ROLES, true).subscribe(
          (data: Role[]) => this.roles = data
        );
        this.lps.getParameter(CollectionName.EMAIL_GROUPS, true).subscribe(
          (data: EmailGroup[]) => this.notificationGroups = data
        );
        break;
      case 'token':
        this.showModal.newToken = true;
        break;
      case 'role':
        this.showModal.newRole = true;
        break;
      case 'location':
        this.showModal.newLocation = true;
        break;
      case 'instrument':
        this.showModal.newInstrument = true;
        break;
      case 'email-group':
        this.showModal.newEmailGroup = true;
        this.lps.getParameter(CollectionName.FORMS, true).subscribe(
          (data: FormTemplate[]) => this.formTemplates = data
        );
        this.lps.getParameter(CollectionName.OPERATORS, true).subscribe(
          (data: Operator[]) => this.operators = data
        );
        break;
      case 'study':
        this.showModal.newStudy = true;
        break;
      case 'form-template':
        this.showModal.newFormTemplate = true;
        break;
      case 'report-template':
        this.showModal.newReportTemplate = true;
        break;
    }
  }

  onConfirm(target: string, confirm: boolean, form?: FormGroup) {
    switch (target) {
      case 'operator':
        if (confirm) {
          this.lps.addOperator(form.value)
            .subscribe((data: any) => this.nzNotification.success('Success', data.message),
              (error: any) => this.nzNotification.error('Error', error.error.message));
        }
        this.showModal.newOperator = false;
        form.reset();
        break;
      case 'token':
        if (confirm) {
          this.lps.addToken().subscribe((data: any) => this.nzNotification.success('Success', data.message),
            (error: any) => this.nzNotification.error('Error', error.error.message));
        }
        this.showModal.newToken = false;
        break;
      case 'role':
        if (confirm) {
          this.lps.addRole(form.value).subscribe((data: any) => this.nzNotification.success('Success', data.message),
            (error: any) => this.nzNotification.error('Error', error.error.message));
        }
        this.showModal.newRole = false;
        break;
      case 'location':
        if (confirm) {
          this.lps.addLocation(form.value).subscribe((data: any) => this.nzNotification.success('Success', data.message),
            (error: any) => this.nzNotification.error('Error', error.error.message));
        }
        this.showModal.newLocation = false;
        break;
      case 'instrument':
        if (confirm) {
          this.lps.addInstrument(form.value).subscribe((data: any) => this.nzNotification.success('Success', data.message),
            (error: any) => this.nzNotification.error('Error', error.error.message));
        }
        this.showModal.newInstrument = false;
        break;
      case 'email-group':
        if (confirm) {
          this.lps.addEmailGroup(form.value).subscribe((data: any) => this.nzNotification.success('Success', data.message),
            (error: any) => this.nzNotification.error('Error', error.error.message));
        }
        this.showModal.newEmailGroup = false;
        break;
    }
  }

  manageCurrentEmailGroup() {
    this.lps.getParameter(CollectionName.EMAIL_GROUPS, true)
  }
}
