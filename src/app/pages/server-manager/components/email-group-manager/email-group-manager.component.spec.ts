import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGroupManagerComponent } from './email-group-manager.component';

describe('EmailGroupManagerComponent', () => {
  let component: EmailGroupManagerComponent;
  let fixture: ComponentFixture<EmailGroupManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailGroupManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGroupManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
