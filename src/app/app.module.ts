import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FileDisplayPipe} from './pipes/file-display.pipe';
import {MandatorySettingComponent} from './components/setting-module/mandatory-setting/mandatory-setting.component';
import {SettingPortalComponent} from './components/setting-module/setting-portal/setting-portal.component';
import {DynamicFormQuestionComponent} from './components/dynamic-form-module/dynamic-form-question/dynamic-form-question.component';
import {DynamicFormWizardComponent} from './components/dynamic-form-module/dynamic-form-wizard/dynamic-form-wizard.component';
import {DynamicFormResultPreviewComponent} from './components/dynamic-form-module/dynamic-form-result-preview/dynamic-form-result-preview.component';
import {DynamicSampleCollectionWizardComponent} from './components/dynamic-form-module/dynamic-sample-collection-wizard/dynamic-sample-collection-wizard.component';
import {FreshStartupComponent} from './components/startup-module/fresh-startup/fresh-startup.component';
import {PrepareLaunchComponent} from './components/startup-module/prepare-launch/prepare-launch.component';
import {ConnectionMonitorComponent} from './components/connection-monitor/connection-monitor.component';
import {TaskPortalComponent} from './components/portal-module/task-portal/task-portal.component';
import {TopNavigationComponent} from './components/navigation-sidebar-left/top-navigation.component';
import {ElectronService} from 'ngx-electron';
import {LoginPageComponent} from './components/login-page/login-page.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule, ClrIconModule} from '@clr/angular';
import {StorageModule} from '@ngx-pwa/local-storage';
import { ManagePortalComponent } from './components/portal-module/manage-portal/manage-portal.component';
import { BrowsePortalComponent } from './components/portal-module/browse-portal/browse-portal.component';
import { TourComponent } from './components/tour/tour.component';
import { ProfilePortalComponent } from './components/portal-module/profile-portal/profile-portal.component';
import { NgZorroAntdModule, NZ_I18N, en_GB } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    FileDisplayPipe,
    MandatorySettingComponent,
    SettingPortalComponent,
    DynamicFormQuestionComponent,
    DynamicFormWizardComponent,
    DynamicFormResultPreviewComponent,
    DynamicSampleCollectionWizardComponent,
    FreshStartupComponent,
    PrepareLaunchComponent,
    ConnectionMonitorComponent,
    TaskPortalComponent,
    TopNavigationComponent,
    LoginPageComponent,
    ManagePortalComponent,
    BrowsePortalComponent,
    TourComponent,
    ProfilePortalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule, ClrIconModule,
    StorageModule.forRoot({IDBNoWrap: true}),
    NgZorroAntdModule
  ],
  providers: [ElectronService, { provide: NZ_I18N, useValue: en_GB }],
  bootstrap: [AppComponent]
})
export class AppModule { }
