import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {QuestionBase} from '../models/dynamic-form-models/question-base';
import {FormValidProcess, WizardPage} from '../models/dynamic-form-models/wizard-page';
import {ElectronService} from 'ngx-electron';
import {UserSettingsService} from './user-settings.service';
import * as _ from 'lodash';
import {LabPipeService} from './lab-pipe.service';
import {DatabaseService} from './database.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  path: any;
  fs: any;
  chokidar: any;

  constructor(private formBuilder: FormBuilder,
              private es: ElectronService,
              private uss: UserSettingsService,
              private lps: LabPipeService,
              private nzNotification: NzNotificationService,
              private ds: DatabaseService) {
    this.path = this.es.remote.require('path');
    this.fs = this.es.remote.require('fs-extra');
    this.chokidar = this.es.remote.require('chokidar');
  }

  toFormGroup(questions: QuestionBase<any>[]) {
    const group = this.formBuilder.group({});
    for (const question of questions) {
      group.controls[question.key] = new FormControl(question.value || '');
      if (question.required) {
        group.controls[question.key].setValidators(Validators.required);
      }
    }
    return group;
  }

  formValidProcessTriage(identifier: string,
                         process: FormValidProcess,
                         processIndex: number,
                         parentPage: WizardPage,
                         formData: any) {
    switch (process.processType) {
      case 'concat':
        this.concat(process, processIndex, parentPage, formData);
        break;
      case 'file-copy':
        this.fileCopy(process, processIndex, parentPage, formData);
        break;
      case 'file-rename':
        this.fileRename(process, processIndex, parentPage, formData);
        break;
      case 'file-upload':
        this.fileUpload(process, processIndex, parentPage, formData, identifier);
        break;
      case 'folder-watch':
        this.folderWatch(process, processIndex, parentPage, formData);
        break;
      case 'check-duplicate':
        this.duplicateCheck(process, processIndex, parentPage, formData);
        break;
    }
  }

  concat(process: FormValidProcess, processIndex: number, parentPage: WizardPage, formData: any) {
    const params = _.cloneDeep(process.parameters);
    if (params.length > 0) {
      const separator = params.shift();
      const data = params.map(p => p.startsWith('::')
        ? formData[parentPage.key][p.replace('::', '')]
        : p);
      process.result = data.join(separator);
      if (process.newField) {
        formData[parentPage.key][process.newField] = process.result;
      }
    }
  }

  fileCopy(process: FormValidProcess, processIndex: number, parentPage: WizardPage, formData: any) {
    const fileDir = this.uss.getFileDirectory();
    console.log(`File directory: [${fileDir}]`);
    if (fileDir) {
      const params = process.parameters;
      const fileFields = params.map(p => p.replace('::', ''));
      const copiedFiles = [];
      fileFields.forEach(ff => {
        if (formData[parentPage.key] && formData[parentPage.key][ff]) {
          formData[parentPage.key][ff].forEach(f => {
            try {
              const copiedFile = this.path.join(fileDir, this.path.basename(f));
              this.fs.copySync(f, copiedFile);
              // TODO check for existing file, append identification number
              copiedFiles.push(copiedFile);
            } catch (err) {
              console.error(err);
            }
          });
          process.result = copiedFiles;
          formData[parentPage.key][ff] = copiedFiles;
        }
      });
    }
  }

  fileRename(process: FormValidProcess, processIndex: number, parentPage: WizardPage, formData: any) {
    const params = _.cloneDeep(process.parameters);
    if (params.length === 2) {
      if (params[0].startsWith('::')) {
        const fileField = params[0].replace('::', '');
        if (formData[parentPage.key] && formData[parentPage.key][fileField]) {
          const files = formData[parentPage.key][fileField];
          const renamedFiles = [];
          const newBaseName = params[1].startsWith('::')
            ? _.get(formData, params[1].replace('::', ''))
            : params[1];
          files.forEach((f, i) => {
            try {
              const renamedFile = this.path.join(this.path.dirname(f), `${newBaseName}@${i}${this.path.extname(f)}`);
              this.fs.renameSync(f, renamedFile);
              // TODO check for existing file, append or increase identification number
              renamedFiles.push(renamedFile);
            } catch (err) {
              console.error(err);
            }
          });
          process.result = renamedFiles;
          formData[parentPage.key][fileField] = renamedFiles;
        }
      }
    }
  }

  fileUpload(process: FormValidProcess, processIndex: number, parentPage: WizardPage, formData: any, identifier: string) {
    const params = _.cloneDeep(process.parameters);
    if (params.length > 0) {
      const fileFields = params.map(p => p.replace('::', ''));
      const uploadedFiles = [];
      fileFields.forEach(ff => {
        if (formData[parentPage.key] && formData[parentPage.key][ff]) {
          formData[parentPage.key][ff].forEach(f => {
            // TODO add file upload api access
            uploadedFiles.push(f);
          });
          // this.lps.uploadFormFiles(identifier, uploadedFiles).pipe(
          //   map((event: HttpEvent<any>) => {
          //     switch (event.type) {
          //       case HttpEventType.UploadProgress:
          //         const progress = Math.round(100 * event.loaded / event.total);
          //         console.log({ status: 'progress', message: progress });
          //         break;
          //       case HttpEventType.Response:
          //         process.result = event.ok ? uploadedFiles : undefined;
          //         console.log(event.body);
          //         break;
          //       default:
          //         console.log(`Unhandled event: ${event.type}`);
          //         break;
          //     }
          //   })
          // );
          this.lps.uploadFormFiles(identifier, uploadedFiles).subscribe(
            (data: any) => {
              process.result = true;
            },
            (error: any) => {
              process.result = false;
              console.log(error);
            }
          );
          process.result = uploadedFiles;
          formData[parentPage.key][ff] = uploadedFiles;
        }
      });
    }
  }

  folderWatch(process: FormValidProcess, processIndex: number, parentPage: WizardPage, formData: any) {
    const params = _.cloneDeep(process.parameters);
    if (params.length === 4) {
      if (params[0].startsWith('::')) {
        const folderToWatch = formData[parentPage.key][params[0].replace('::', '')][0];
        const fileTypeToWatch = params[1];
        const numberExpecting = _.parseInt(params[2]);
        const periodWatching = _.parseInt(params[3]);
        const watchPath = this.path.join(folderToWatch, fileTypeToWatch);
        const watcher = this.chokidar.watch(watchPath, {
          persistent: true,
          ignoreInitial: true,
          followSymlinks: false,
          cwd: '.',
          disableGlobbing: false,
          usePolling: false,
          alwaysStat: true,
          awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
          },
          ignorePermissionErrors: false
        });
        const files = [];
        watcher
          .on('ready', () =>
            this.nzNotification.success('Success', 'File watcher instance ready'))
          .on('add', path => {
            console.log(`[${path}] added.`);
            files.push(this.path.resolve(path));
            if (files.length === numberExpecting) {
              process.result = files;
              if (process.newField) {
                formData[parentPage.key][process.newField] = parentPage.formValidProcess[processIndex].result;
              }
              this.nzNotification.info('File watcher', 'File watcher reached expected number of files.');
              watcher.close();
            }
          });
        if (periodWatching > 0) {
          setTimeout(() => {
            this.nzNotification.info('File watcher', 'File watcher reached waiting time limit.');
            if (!process.result && files) {
              process.result = files;
              if (process.newField) {
                formData[parentPage.key][process.newField] = process.result;
              }
            }
            if (!watcher.closed) {
              watcher.close();
            }
          }, periodWatching * 1000);
        }
      }
    }
  }

  duplicateCheck(process: FormValidProcess, processIndex: number, parentPage: WizardPage, formData: any) {
    const params = _.cloneDeep(process.parameters);
    if (params.length > 0) {
      const query: any = {};
      params.forEach(p => p.startsWith('::')
        ? query[`data.record.${parentPage.key}.${p.replace('::', '')}`] = formData[parentPage.key][p.replace('::', '')]
        : query[`data.record.${parentPage.key}.${p}`] = formData[parentPage.key][p]);
      console.log(query);
      this.ds.findRecord(query)
        .then((data: any[]) => process.result = data.length > 0 ? 'Already exist' : 'No existing record')
        .catch((error: any) => process.result = 'Error checking duplicates');
    }
  }
}
