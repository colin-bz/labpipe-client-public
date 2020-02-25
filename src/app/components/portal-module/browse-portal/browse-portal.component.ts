import {Component, OnInit} from '@angular/core';
import {LabPipeService} from '../../../services/lab-pipe.service';
import {DatabaseService} from '../../../services/database.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-browse-portal',
  templateUrl: './browse-portal.component.html',
  styleUrls: ['./browse-portal.component.css']
})
export class BrowsePortalComponent implements OnInit {

  remoteRecords: any[] = [];
  localRecords: any[] = [];

  remoteReport: any = {};

  showRemoteRecordReport: boolean;
  constructor(private lps: LabPipeService, private dbs: DatabaseService, private nzNotification: NzNotificationService) { }

  ngOnInit() {
    this.loadRemoteRecords();
    this.loadLocalRecords();
  }

  loadRemoteRecords() {
    this.lps.getAllRecord(true).subscribe(
      (data: any) => {
        this.remoteRecords = data;
      },
      (error: any) => console.log(error)
    );
  }

  loadLocalRecords() {
    this.dbs.readData().then((data: any[]) => {
      this.localRecords = data;
    });
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

  report(record: any) {
    this.remoteReport = {record};
    this.showRemoteRecordReport = true;
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

  closeReport() {
    this.remoteReport = {};
    this.showRemoteRecordReport = false;
  }

  downloadPdf() {
    // TODO generate pdf report
  }

}
