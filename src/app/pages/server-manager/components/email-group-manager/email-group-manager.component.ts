import { Component, OnInit } from '@angular/core';
import {CollectionName, EmailGroup} from '../../../../models/parameter.model';
import {LabPipeService} from '../../../../services/lab-pipe.service';

@Component({
  selector: 'app-email-group-manager',
  templateUrl: './email-group-manager.component.html',
  styleUrls: ['./email-group-manager.component.css']
})
export class EmailGroupManagerComponent implements OnInit {
  selected: EmailGroup;
  options: EmailGroup[] = [];
  loadingOptions = false;

  constructor(private lps: LabPipeService) { }

  ngOnInit() {
    this.getOptions();
  }

  getOptions() {
    this.loadingOptions = true;
    this.options = [];
    this.lps.getParameter(CollectionName.EMAIL_GROUPS, true).subscribe(
      (data: EmailGroup[]) => this.options = data,
      error => console.log(error),
      () => this.loadingOptions = false
    );
  }

}
