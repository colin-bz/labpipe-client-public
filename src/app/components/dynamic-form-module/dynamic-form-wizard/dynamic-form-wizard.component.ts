import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {DynamicFormResultPreviewComponent} from '../dynamic-form-result-preview/dynamic-form-result-preview.component';
import {Wizard} from '../../../models/dynamic-form-models/wizard';
import {FormGroup} from '@angular/forms';
import {UserSettingsService} from '../../../services/user-settings.service';
import {DynamicFormService} from '../../../services/dynamic-form.service';
import {DatabaseService} from '../../../services/database.service';
import {ElectronService} from 'ngx-electron';
import {FormValidProcess, WizardPage} from '../../../models/dynamic-form-models/wizard-page';
import {QuestionBase} from '../../../models/dynamic-form-models/question-base';
import {InputQuestion} from '../../../models/dynamic-form-models/question-input';
import {SelectQuestion} from '../../../models/dynamic-form-models/question-select';
import {TrueFalseQuestion} from '../../../models/dynamic-form-models/question-truefalse';
import {FileQuestion} from '../../../models/dynamic-form-models/question-file';
import {LabPipeService} from '../../../services/lab-pipe.service';
import {TemporaryDataService} from '../../../services/temporary-data.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-dynamic-form-wizard',
  templateUrl: './dynamic-form-wizard.component.html',
  styleUrls: ['./dynamic-form-wizard.component.css']
})

export class DynamicFormWizardComponent implements OnInit, OnDestroy {
  location: any;
  instrument: any;
  study: any;

  currentStep = 0;

  formCode: string;
  formTemplates: any;
  wizardTemplate: Wizard;
  form: FormGroup;
  remoteUrl: string;
  isFormReady: boolean;
  isFormVisible: boolean;
  result: any;
  formData: any;
  @ViewChild('formDataPreview', {static: false}) formDataPreview: DynamicFormResultPreviewComponent;

  showMultipleFormCodeDialog: boolean;
  showNoFormDialog: boolean;
  showSavedDialog: boolean;

  sentToServer: boolean;

  actionIdentifier: string;

  constructor(private us: UserSettingsService,
              private dfs: DynamicFormService,
              private ds: DatabaseService,
              private es: ElectronService,
              private lps: LabPipeService,
              private tds: TemporaryDataService,
              private nzNotification: NzNotificationService,
              private zone: NgZone,
              private http: HttpClient,
              private router: Router) {
    this.formTemplates = [];
    this.location = this.tds.location;
    this.instrument = this.tds.instrument;
    this.study = this.tds.study;
  }

  ngOnInit() {
    // TODO getParameter formCode from current study
    this.getFormTemplate();
  }

  ngOnDestroy() {
    this.tds.resetTask();
  }

  getFormTemplate() {
    this.lps.getForm(this.study.identifier, this.instrument.identifier).subscribe((data: any) => {
        this.formTemplates = data;
        switch (this.formTemplates.length) {
          case 0:
            this.showNoFormDialog = true;
            break;
          case 1:
            this.prepareForm(this.formTemplates[0]);
            break;
          default:
            this.showMultipleFormCodeDialog = true;
            break;
        }
      },
      (error: any) => {
        console.log(error);
        this.nzNotification.warning('Warning', 'Unable to getParameter form from server. Trying local forms.');
        this.formTemplates = this.us.getForm(this.study.identifier, this.instrument.identifier);
        switch (this.formTemplates.length) {
          case 0:
            this.showNoFormDialog = true;
            break;
          case 1:
            this.prepareForm(this.formTemplates[0]);
            break;
          default:
            this.showMultipleFormCodeDialog = true;
            break;
        }
      }
    );
  }

  getFormTemplateWithCode() {
    if (this.formCode) {
      this.showMultipleFormCodeDialog = false;
      this.lps.getFormWithIdentifier(this.formCode).subscribe((data: any) => {
          this.nzNotification.success('Success', 'Form loaded. Preparation in progress.');
          this.us.setForm(data);
          this.prepareForm(data);
        },
        error => {
          this.nzNotification.warning('Warning', 'Unable to getParameter form from server. Trying local forms.');
          const data = this.us.getFormWithIdentifier(this.formCode);
          if (data) {
            this.prepareForm(data);
          } else {
            this.showNoFormDialog = true;
          }
        }
      );
    }
  }

  prepareForm(data: any) {
    this.us.setForm(data);
    this.actionIdentifier = this.lps.getUid();
    this.formData = {
      actionIdentifier: this.actionIdentifier,
      formIdentifier: data.identifier,
      studyIdentifier: data.studyIdentifier,
      instrumentIdentifier: data.instrumentIdentifier,
      record: {}
    };
    this.remoteUrl = data.url;
    this.wizardTemplate = new Wizard({title: data.template.title, pages: []});
    data.template.pages.forEach(page => {
      const p = new WizardPage({
        key: page.key,
        title: page.title,
        navTitle: page.navTitle,
        requireValidForm: page.requireValidForm,
        order: page.order
      });
      page.questions.forEach((q: QuestionBase<any>) => {
        switch (q.controlType) {
          case 'input':
            p.questions.push(new InputQuestion(q));
            break;
          case 'select':
            p.questions.push(new SelectQuestion(q));
            break;
          case 'truefalse':
            p.questions.push(new TrueFalseQuestion(q));
            break;
          case 'file':
            p.questions.push(new FileQuestion(q));
            break;
        }
      });
      page.formValidProcess.forEach(fvp => {
        p.formValidProcess.push(new FormValidProcess(fvp));
      });
      p.formValidProcess = p.formValidProcess.sort((a, b) => a.order - b.order);
      this.wizardTemplate.pages.push(p);
    });
    this.wizardTemplate.pages = this.wizardTemplate.pages.sort((a, b) => a.order - b.order);
    if (this.wizardTemplate) {
      this.wizardTemplate.pages.forEach((page, index) =>
        this.wizardTemplate.pages[index].pageForm = this.dfs.toFormGroup(page.questions));
      this.isFormReady = true;
      this.nzNotification.success('Success', 'Form preparation completed.');
      this.isFormVisible = true;
      console.log(this.currentStep);
    }
  }

  onQuestionValue(parentPage: WizardPage, controlKey: string, questionValue: any) {
    const updatedValue = {};
    updatedValue[controlKey] = questionValue;
    parentPage.pageForm.patchValue(updatedValue, {emitEvent: false});
    this.onFormValid(parentPage);
    console.log(parentPage.pageForm.value);
  }

  onFormValid(parentPage: WizardPage) {
    if (parentPage.pageForm.valid) {
      this.formData.record[parentPage.key] = parentPage.pageForm.value;
      parentPage.formValidProcess.forEach((process, index) => {
        if (process.auto) {
          this.dfs.formValidProcessTriage(this.actionIdentifier, process, index, parentPage, this.formData.record);
        }
      });
      console.log(parentPage.formValidProcess);
    }
  }

  activateProcess(parentPage: WizardPage, process: FormValidProcess, processIndex: number) {
    this.dfs.formValidProcessTriage(this.actionIdentifier, process, processIndex, parentPage, this.formData.record);
  }

  saveResult() {
    const record = {
      created: new Date(),
      saved_by: this.tds.operator.username,
      url: this.remoteUrl,
      ...this.result
    };
    this.ds.saveData(this.actionIdentifier, record);
    if (this.tds.connected) {
      this.sentToServer = true;
      this.lps.postRecord(this.remoteUrl, record)
        .subscribe((data: any) => {
            this.nzNotification.success('Success', data.message);
          },
          (error: any) => {
            this.nzNotification.success('Error', error.error.message);
          });
    } else {
      this.sentToServer = false;
    }
    this.showSavedDialog = true;
  }

  clipboardCopy(value: any) {
    this.es.clipboard.writeText(value);
    this.nzNotification.info('Copied to clipboard', value as string);
  }

  toPortal() {
    this.showNoFormDialog = false;
    this.showSavedDialog = false;
    this.tds.resetTask();
    this.router.navigate(['tasks']);
  }

  stepBack() {
    this.currentStep -= 1;
  }

  stepNext() {
    this.currentStep += 1;
  }

  stepDone() {
    this.result = this.formData;
    this.formDataPreview.updateResult();
    this.nzNotification.warning('Not saved',
      'Please note that your collection record has not yet been saved. ' +
      'Please review the data before saving.');
  }

  onStepChange(step: number) {

    if (this.wizardTemplate.pages[this.currentStep].pageForm.valid) {

    }
    this.currentStep = step;
    console.log(this.currentStep);
  }
}
