import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {ConnectionMonitorComponent} from './components/monitor-module/connection-monitor/connection-monitor.component';
import {TopNavigationComponent} from './components/navigation-sidebar-left/top-navigation.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ClarityModule} from '@clr/angular';
import {ElectronService} from 'ngx-electron';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ClarityModule],
      declarations: [
        AppComponent, ConnectionMonitorComponent, TopNavigationComponent
      ],
      providers: [ElectronService]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'labpipe-client-public'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('labpipe-client-public');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to labpipe-client-public!');
  });
});
