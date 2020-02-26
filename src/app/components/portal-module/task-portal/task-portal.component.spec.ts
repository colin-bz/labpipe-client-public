import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskPortalComponent} from './task-portal.component';
import {ClarityModule} from '@clr/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicSampleCollectionWizardComponent} from '../../dynamic-form-module/dynamic-sample-collection-wizard/dynamic-sample-collection-wizard.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ElectronService} from 'ngx-electron';

describe('TaskPortalComponent', () => {
  let component: TaskPortalComponent;
  let fixture: ComponentFixture<TaskPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [ TaskPortalComponent, DynamicSampleCollectionWizardComponent ],
      providers: [ElectronService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
