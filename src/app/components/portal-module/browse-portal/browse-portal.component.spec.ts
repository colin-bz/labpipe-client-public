import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BrowsePortalComponent} from './browse-portal.component';

describe('BrowsePortalComponent', () => {
  let component: BrowsePortalComponent;
  let fixture: ComponentFixture<BrowsePortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsePortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
