import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-dynamic-form-result-preview',
  templateUrl: './dynamic-form-result-preview.component.html',
  styleUrls: ['./dynamic-form-result-preview.component.css']
})
export class DynamicFormResultPreviewComponent implements OnInit {

  private interalData: any;

  result: {form: string, field: string, value: any, iterable: boolean}[] = [];
  preview: any;


  constructor() { }

  ngOnInit() {
  }

  @Input('data')
  set data(data: any) {
    this.interalData = data;
    this.updateResult();
  }

  get data() {
    return this.interalData;
  }

  public updateResult() {
    const keys = Object.keys(this.interalData);
    this.result = [];
    keys.forEach(k => {
      if (k !== 'form_code' && k !== 'study_code' && k !== 'instrument_code' && k !== 'actionIdentifier') {
        const childKeys = Object.keys(this.interalData[k]);
        childKeys.forEach(ck => {
          this.result.push({form: k, field: ck, value: this.interalData[k][ck], iterable: Array.isArray(this.interalData[k][ck])});
        });
      }
    });
    this.preview = _.groupBy(this.result, 'form');
  }

}
