import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConnectionMonitorComponent} from './connection-monitor.component';
import {ClarityModule} from '@clr/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ElectronService} from 'ngx-electron';

describe('ConnectionMonitorComponent', () => {
  let component: ConnectionMonitorComponent;
  let fixture: ComponentFixture<ConnectionMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule, ReactiveFormsModule],
      declarations: [ ConnectionMonitorComponent ],
      providers: [ElectronService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
