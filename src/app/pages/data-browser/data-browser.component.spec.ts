import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DataBrowserComponent} from './data-browser.component';

describe('BrowsePortalComponent', () => {
  let component: DataBrowserComponent;
  let fixture: ComponentFixture<DataBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
