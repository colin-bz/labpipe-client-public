import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrepareLaunchComponent} from './prepare-launch.component';
import {ClarityModule} from '@clr/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ElectronService} from 'ngx-electron';

describe('PrepareLaunchComponent', () => {
  let component: PrepareLaunchComponent;
  let fixture: ComponentFixture<PrepareLaunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [ PrepareLaunchComponent ],
      providers: [ElectronService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
