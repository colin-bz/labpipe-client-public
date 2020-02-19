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
import {InAppAlertService, InAppMessage} from '../../../services/in-app-alert.service';
import {TemporaryDataService} from '../../../services/temporary-data.service';

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

  messages: InAppMessage[] = [];
  formMessages: InAppMessage[] = [];

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

  showNotSavedWarning: boolean;
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
              private iaas: InAppAlertService,
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
        this.iaas.warn('Unable to getParameter form from server. Trying local forms.', this.messages);
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
        this.iaas.success('Form loaded. Preparation in progress.', this.messages);
        this.us.setForm(data);
        this.prepareForm(data);
        },
        error => {
          this.iaas.warn('Unable to getParameter form from server. Trying local forms.', this.messages);
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
      record: {}};
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
      this.iaas.success('Form preparation completed.', this.messages);
      this.isFormVisible = true;
      console.log(this.currentStep);
    }
  }

  showForm() {
    this.isFormVisible = true;
  }

  onQuestionValue(parentPage: WizardPage, controlKey: string, questionValue: any) {
    const updatedValue = {};
    updatedValue[controlKey] = questionValue;
    parentPage.pageForm.patchValue(updatedValue, {emitEvent: false});
    this.onFormValid(parentPage);
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
    this.dfs.formValidProcessTriage(this.actionIdentifier, process, processIndex, parentPage, this.formData.record, this.formMessages);
  }

  onWizardFinish() {
    this.result = this.formData;
    this.formDataPreview.updateResult();
    this.showNotSavedWarning = true;
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
            this.iaas.success(data.message, this.messages);
          },
          (error: any) => {
            this.iaas.error(error.error.message, this.messages);
          });
    } else {
      this.sentToServer = false;
    }
    this.showSavedDialog = true;
  }

  clipboardCopy(value: any) {
    this.es.clipboard.writeText(value);
  }

  toPortal() {
    this.showNoFormDialog = false;
    this.showSavedDialog = false;
    this.tds.resetTask();
    this.router.navigate(['tasks']);
  }

  stepBack() {

  }

  stepNext() {

  }

  stepDone() {

  }

  onStepChange(step: number) {
    this.currentStep = step;
  }
}
