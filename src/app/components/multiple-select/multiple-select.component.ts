import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LabPipeService} from '../../services/lab-pipe.service';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css']
})
export class MultipleSelectComponent implements OnInit, OnChanges {

  @Input() title = '';
  @Input() options: any[] = [];
  @Input() valueField: string = undefined;
  @Input() displayField: string = undefined;
  @Output() valueChanged = new EventEmitter();

  id: string;

  selected = {};
  select: any;

  constructor(private lps: LabPipeService) {
    this.id = this.lps.getUid();
    this.selected[this.id] = new Set();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.options = changes.options.currentValue;
  }

  onSelect() {
    if (this.select) {
      this.selected[this.id].add(this.select);
    }
    this.update();
  }

  unselect(element: any) {
    this.selected[this.id].delete(element);
    this.update();
  }

  update() {
    this.valueChanged.emit(Array.from(this.selected[this.id]));
  }

  clear() {
    this.selected[this.id] = new Set();
    this.select = undefined;
  }

}
