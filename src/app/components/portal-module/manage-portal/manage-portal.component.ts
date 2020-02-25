import {Component, OnInit, ViewChild} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LabPipeService} from '../../../services/lab-pipe.service';
import {CollectionName, EmailGroup, FormTemplate, Operator, Role, Study} from '../../../models/parameter.model';
import {MultipleSelectComponent} from '../../multiple-select/multiple-select.component';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-manage-portal',
  templateUrl: './manage-portal.component.html',
  styleUrls: ['./manage-portal.component.css']
})
export class ManagePortalComponent implements OnInit {

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

  @ViewChild('aosvc', {static: false}) aosvc: MultipleSelectComponent;
  @ViewChild('aorvc', {static: false}) aorvc: MultipleSelectComponent;
  @ViewChild('aoegvc', {static: false}) aoegvc: MultipleSelectComponent;

  studies: Study[] = [];
  roles: Role[] = [];
  notificationGroups: EmailGroup[] = [];
  operators: Operator[] = [];
  formTemplates: FormTemplate[] = [];

  constructor(private formBuilder: FormBuilder, private lps: LabPipeService, private nzNotification: NzNotificationService) {
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
        this.aosvc.clear();
        this.aorvc.clear();
        this.aoegvc.clear();
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

  updateForm(form: FormGroup, field: string, event: any) {
    // switch (form) {
    //   case this.operatorForm:
    //     switch (field) {
    //       case 'projects':
    //       case 'roles':
    //       case 'notificationGroup':
    //         form.get(field).setValue(event);
    //         break;
    //     }
    //     break;
    //   case this.instrumentForm:
    //     switch (field) {
    //       case 'fileType':
    //         form.get(field).setValue(event);
    //         break;
    //     }
    //     break;
    // }
    form.get(field).setValue(event);
  }
}
