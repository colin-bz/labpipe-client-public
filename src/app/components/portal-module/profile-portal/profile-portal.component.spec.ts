import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfilePortalComponent} from './profile-portal.component';

describe('ProfilePortalComponent', () => {
  let component: ProfilePortalComponent;
  let fixture: ComponentFixture<ProfilePortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
