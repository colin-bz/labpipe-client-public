import {Component, OnInit, TemplateRef} from '@angular/core';
import {LabPipeService} from '../../../services/lab-pipe.service';
import {DatabaseService} from '../../../services/database.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import * as _ from 'lodash';

@Component({
  selector: 'app-browse-portal',
  templateUrl: './browse-portal.component.html',
  styleUrls: ['./browse-portal.component.css']
})
export class BrowsePortalComponent implements OnInit {
  mapOfExpandRemoteData: { [key: string]: boolean } = {};
  mapOfExpandLocalData: { [key: string]: boolean } = {};

  remoteRecords: any[] = [];
  localRecords: any[] = [];

  remoteLoading: boolean;
  localLoading: boolean;

  remoteReport: any = {};
  remoteReportDataPreview: any;

  remoteReportModal: NzModalRef;

  constructor(private lps: LabPipeService, private dbs: DatabaseService,
              private nzNotification: NzNotificationService,
              private nzModal: NzModalService) {
  }

  ngOnInit() {
    this.loadRemoteRecords();
    this.loadLocalRecords();
  }

  loadRemoteRecords() {
    this.remoteLoading = true;
    this.lps.getAllRecord(true).subscribe(
      (data: any) => {
        this.remoteRecords = data;
      },
      (error: any) => console.log(error),
      () => this.remoteLoading = false
    );
  }

  loadLocalRecords() {
    this.localLoading = true;
    this.dbs.readData().then((data: any[]) => {
      this.localRecords = data;
    }).finally(() => this.localLoading = false);
  }

  upload(record: any) {
    this.lps.postRecord(record.data.url, record.data)
      .subscribe((data: any) => {
          this.nzNotification.success('Success', data.message);
        },
        (error: any) => {
          this.nzNotification.error('Error', error.error.message);
        });
  }


  showRemoteReportModal(record: any, modalContent: TemplateRef<{}>, modalFooter: TemplateRef<{}>) {
    this.report(record);
    this.remoteReportModal = this.nzModal.create({
      nzTitle: 'Record Preview',
      nzContent: modalContent,
      nzFooter: modalFooter
    });
  }

  destroyRemoteReportModal() {
    this.remoteReportModal.destroy();
    this.remoteReport = {};
  }

  report(record: any) {
    this.remoteReport = {record};
    this.remoteReportDataPreview = _.groupBy(record.record, 'form');
    this.lps.getStudy(record.studyIdentifier).subscribe(
      (data: any) => {
        this.remoteReport.study = data;
      }
    );
    this.lps.getInstrument(record.instrumentIdentifier).subscribe(
      (data: any) => {
        this.remoteReport.instrument = data;
      }
    );
  }

  isArray(data: any) {
    return _.isArray(data);
  }

  downloadPdf() {
    // TODO generate pdf report
  }

}
