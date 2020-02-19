import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ElectronService} from 'ngx-electron';
import OpenDialogOptions = Electron.OpenDialogOptions;
import FileFilter = Electron.FileFilter;
import {QuestionBase} from '../../../models/dynamic-form-models/question-base';
import {UserSettingsService} from '../../../services/user-settings.service';
import {SelectQuestion} from '../../../models/dynamic-form-models/question-select';
import {InputQuestion} from '../../../models/dynamic-form-models/question-input';
import {FileQuestion} from '../../../models/dynamic-form-models/question-file';
import {TemporaryDataService} from '../../../services/temporary-data.service';
import {min} from 'rxjs/operators';
import {UploadFile} from 'ng-zorro-antd';

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css']
})
export class DynamicFormQuestionComponent implements OnInit {

  @Input() qBase: QuestionBase<any>;
  @Input() form: FormGroup;
  @Output() qValue = new EventEmitter<any>();

  options: any[] = [];
  inputPattern = null;
  fileList: UploadFile[] = [];
  fileFilter: FileFilter[] = [{ name: 'All Files', extensions: ['*'] }];
  // tslint:disable-next-line:max-line-length
  fileInputProperties: ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory')[] = ['openFile'];

  constructor(private uss: UserSettingsService,
              private tds: TemporaryDataService,
              private es: ElectronService,
              private zone: NgZone) {}

  ngOnInit() {
    this.prepareAttributes();
    this.form.controls[this.qBase.key].valueChanges.subscribe(value => {
      this.qValue.emit(value);
    });
  }

  prepareAttributes() {
    switch (this.qBase.controlType) {
      case 'select':
        const sq = this.qBase as SelectQuestion;
        if (sq.options.startsWith('__') && sq.options.endsWith('__')) {
          const optionIndex = sq.options.replace(/__/g, '').split('::');
          let optionValues = this.tds.study;
          optionIndex.forEach((oi: string) => {
            optionValues = optionValues[oi];
          });
          if (typeof optionValues === 'string') {
            this.options.push({value: optionValues, name: optionValues});
          } else if (Array.isArray(optionValues)) {
            optionValues.forEach((ai) => {
              if (typeof ai === 'string') {
                this.options.push({value: ai, name: ai});
              } else if (typeof ai === 'object') {
                this.options.push({value: ai, name: ai.name});
              }
            });
          }
        }
        break;
      case 'input':
        const iq = this.qBase as InputQuestion;
        if (iq.pattern) {
          this.inputPattern = `[0-9]{${iq.pattern}}`;
        }
        // if (iq.pattern.startsWith('__') && iq.pattern.endsWith('__')) {
        //   const patternIndex = iq.pattern.replace(/__/g, '').split('::');
        //   let patternValues = this.tds.study;
        //   patternIndex.forEach((oi: string) => {
        //     patternValues = patternValues[oi];
        //   });
        //   this.inputPattern = '[0-9]{' + patternValues + '}';
        // }
        break;
      case 'file':
        const fq = this.qBase as FileQuestion;
        this.fileFilter = fq.filter;
        switch (fq.target) {
          case 'file':
            this.fileInputProperties = ['openFile'];
            break;
          case 'directory':
            this.fileInputProperties = ['openDirectory'];
            break;
        }
        if (fq.multiple) {
          this.fileInputProperties.push('multiSelections');
        }
        console.log(this.fileInputProperties);
        console.log(this.fileFilter);
        break;
      default:
        break;
    }
  }

  handleSelectedFile() {
    console.log(this.fileList);
  }

  addFile() {
    const options: OpenDialogOptions = {
      filters: this.fileFilter,
      properties: this.fileInputProperties
    };
    this.es.remote.dialog.showOpenDialog(this.es.remote.getCurrentWindow(),
        options).then(result => {
      if (result.filePaths === undefined) { return; }
      this.zone.run(() => {
        this.form.controls[this.qBase.key].setValue(result.filePaths);
      });
    });
  }

  setNow(form: FormGroup, field) {
    const date = new Date();
    const year = date.getFullYear();
    const m = date.getMonth() + 1;
    const month = m > 9 ? m : `0${m}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    const minute = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    const value = `${year}-${month}-${day}T${hour}:${minute}`;
    form.get(field).setValue(value);
  }

}
