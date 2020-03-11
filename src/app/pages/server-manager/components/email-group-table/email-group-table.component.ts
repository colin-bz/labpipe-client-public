import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LabPipeService} from '../../../../services/lab-pipe.service';
import {CollectionName, EmailGroup, Operator} from '../../../../models/parameter.model';

@Component({
  selector: 'app-email-group-table',
  templateUrl: './email-group-table.component.html',
  styleUrls: ['./email-group-table.component.css']
})
export class EmailGroupTableComponent implements OnInit, OnChanges {
  @Input() emailGroup: EmailGroup;
  tableReady: boolean;
  operators: Operator[] = [];
  adminId: { [key: string]: boolean } = {};
  memberId: { [key: string]: boolean } = {};

  constructor(private lps: LabPipeService) {
  }

  ngOnInit() {
    this.getOperators();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.emailGroup = changes.emailGroup ? changes.emailGroup.currentValue : changes.emailGroup;
    this.adminId = {};
    this.memberId = {};
    this.operators = [];
    this.getOperators();
    if (this.emailGroup) {
      this.emailGroup.admin.forEach(m => this.adminId[m] = true);
      this.emailGroup.member.forEach(m => this.memberId[m] = true);
    }
  }

  getOperators() {
    this.tableReady = false;
    this.lps.getParameter(CollectionName.OPERATORS, true).subscribe(
      (data: Operator[]) => this.operators = data,
      error => console.log(error),
      () => this.tableReady = true
    );
  }

  update() {
    console.log(this.memberId);
    console.log(this.adminId);
  }

}
