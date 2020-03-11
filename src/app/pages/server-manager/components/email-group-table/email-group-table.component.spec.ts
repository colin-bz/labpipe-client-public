import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGroupTableComponent } from './email-group-table.component';

describe('EmailGroupManagerComponent', () => {
  let component: EmailGroupTableComponent;
  let fixture: ComponentFixture<EmailGroupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailGroupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
