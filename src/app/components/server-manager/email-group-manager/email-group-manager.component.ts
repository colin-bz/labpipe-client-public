import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LabPipeService} from '../../../services/lab-pipe.service';
import {CollectionName, EmailGroup, Operator} from '../../../models/parameter.model';

@Component({
  selector: 'app-email-group-manager',
  templateUrl: './email-group-manager.component.html',
  styleUrls: ['./email-group-manager.component.css']
})
export class EmailGroupManagerComponent implements OnInit, OnChanges {
  @Input() emailGroup: EmailGroup;
  @Input() subGroup: 'member' | 'admin' = 'member';
  tableReady: boolean;
  operators: Operator[] = [];
  checkedId: { [key: string]: boolean } = {};

  constructor(private lps: LabPipeService) {
  }

  ngOnInit() {
    this.getOperators();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.emailGroup = changes.emailGroup ? changes.emailGroup.currentValue : changes.emailGroup;
    this.checkedId = {};
    this.operators = [];
    if (this.emailGroup) {
      this.emailGroup[this.subGroup].forEach(m => this.checkedId[m] = true);
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

}
