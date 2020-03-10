import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FreshStartupComponent} from './components/startup-module/fresh-startup/fresh-startup.component';
import {SettingPortalComponent} from './components/setting-module/setting-portal/setting-portal.component';
import {PrepareLaunchComponent} from './components/startup-module/prepare-launch/prepare-launch.component';
import {TaskPortalComponent} from './components/portal-module/task-portal/task-portal.component';
import {UserLoginComponent} from './pages/user-login/user-login.component';
import {DynamicFormWizardComponent} from './components/dynamic-form-module/dynamic-form-wizard/dynamic-form-wizard.component';
import {ManagePortalComponent} from './components/portal-module/manage-portal/manage-portal.component';
import {DataBrowserComponent} from './pages/data-browser/data-browser.component';
import {AuthGuardService} from './services/auth-guard.service';
import {ProfilePortalComponent} from './components/portal-module/profile-portal/profile-portal.component';
import {NoAccessComponent} from './pages/no-access/no-access.component';
import {AdminGuardService} from './services/admin-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'fresh-startup', pathMatch: 'full'},
  {path: 'fresh-startup', component: FreshStartupComponent},
  {path: 'settings', component: SettingPortalComponent},
  {path: 'prepare-launch', component: PrepareLaunchComponent},
  {path: 'user-login', component: UserLoginComponent},
  {path: 'tasks', component: TaskPortalComponent, canActivate: [AuthGuardService]},
  {path: 'browse', component: DataBrowserComponent, canActivate: [AuthGuardService]},
  {path: 'manage', component: ManagePortalComponent, canActivate: [AuthGuardService, AdminGuardService]},
  {path: 'profile', component: ProfilePortalComponent, canActivate: [AuthGuardService]},
  {path: 'dynamic-form-wizard', component: DynamicFormWizardComponent, canActivate: [AuthGuardService]},
  {path: 'error/no-access', component: NoAccessComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
