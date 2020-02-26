import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TopNavigationComponent} from './top-navigation.component';
import {ClarityModule} from '@clr/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {ElectronService} from 'ngx-electron';

describe('TopNavigationComponent', () => {
  let component: TopNavigationComponent;
  let fixture: ComponentFixture<TopNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [ TopNavigationComponent ],
      providers: [ElectronService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
