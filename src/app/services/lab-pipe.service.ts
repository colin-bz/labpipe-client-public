import {Injectable} from '@angular/core';
import {UserSettingsService} from './user-settings.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ElectronService} from 'ngx-electron';
import {ShareDataService} from './share-data.service';
import {EmailGroup, Instrument, Location, Operator, Role, Study} from '../models/parameter.model';

@Injectable({
  providedIn: 'root'
})
export class LabPipeService {
  apiRoot: string;
  uuid4: any;
  path: any;
  fs: any;

  operator: any;
  password: string;

  constructor(private uss: UserSettingsService,
              private tds: ShareDataService,
              private es: ElectronService,
              private http: HttpClient) {
    this.path = this.es.remote.require('path');
    this.fs = this.es.remote.require('fs-extra');
    this.loadApiRoot();
    this.uuid4 = this.es.remote.require('uuid/v4');
    this.tds.operator.subscribe(value => this.operator = value);
    this.tds.password.subscribe(value => this.password = value);
  }

  loadApiRoot() {
    this.apiRoot = this.uss.getApiRoot();
  }

  userAuthRequestOptions() {
    return this.operator && this.password ? {
      headers: new HttpHeaders({
        Authorization: `Basic ${btoa(`${this.operator.username}:${this.password}`)}`
      })
    } : {};
  }

  tokenAuthRequestOptions(token?: string, key?: string) {
    return token && key ? {
      headers: new HttpHeaders({
        Authorization: `Basic ${btoa(`${token}:${key}`)}`
      })
    } : this.uss.getApiToken() && this.uss.getApiKey() ? {
      headers: new HttpHeaders({
        Authorization: `Basic ${btoa(`${this.uss.getApiToken()}:${this.uss.getApiKey()}`)}`
      })
    } : {};
  }

  heartbeat() {
    return this.http.head(`${this.apiRoot}/api/general/connect/public`);
  }

  publicAccess(apiRoot: string) {
    return this.http.get(`${apiRoot}/api/general/connect/public`);
  }

  tokenAccess(token?: string, key?: string) {
    const options = {
      ...this.tokenAuthRequestOptions(token, key)
    };
    return this.http.get(`${this.apiRoot}/api/general/connect/token`, options);
  }

  getParameter(identifier: string, useAuth?: boolean) {
    const url = `${this.apiRoot}/api/parameter/identifier/${identifier}`;
    const options = useAuth ? this.userAuthRequestOptions() : this.tokenAuthRequestOptions();
    return this.http.get(url, options);
  }

  listForms() {
    const url = `${this.apiRoot}/api/form/template/all`;
    return this.http.get(url, this.tokenAuthRequestOptions());
  }

  getForm(studyIdentifier: string, instrumentIdentifier: string) {
    const url = `${this.apiRoot}/api/form/template/study/${studyIdentifier}/instrument/${instrumentIdentifier}`;
    return this.http.get(url, this.tokenAuthRequestOptions());
  }

  getFormWithIdentifier(identifier: string) {
    const url = `${this.apiRoot}/api/form/template/identifier/${identifier}`;
    return this.http.get(url, this.tokenAuthRequestOptions());
  }

  postRecord(remoteUrl: string, record: any) {
    const url = `${this.apiRoot}${remoteUrl}`;
    return this.http.post(url, record, this.userAuthRequestOptions());
  }

  uploadFormFiles(identifier: string, paths: string[]) {
    const url = `${this.apiRoot}/api/upload/file/form`;
    const options = {
      params: new HttpParams().set('identifier', identifier),
      // reportProgress: true,
      // observe: 'events',
      ...this.userAuthRequestOptions()
    };
    const formData = new FormData();
    paths.forEach(p => formData.append('files', new File(this.fs.readFileSync(p), this.path.basename(p))));
    return this.http.post(url, formData, options );
  }

  getAllRecord(useAuth: boolean = false, studyIdentifier?: string) {
    const url = studyIdentifier ? `${this.apiRoot}/api/query/record/all/${studyIdentifier}` : `${this.apiRoot}/api/query/record/all`;
    const options = useAuth ? this.userAuthRequestOptions() : this.tokenAuthRequestOptions();
    return this.http.get(url, options);
  }

  getAllStudies() {
    const url = `${this.apiRoot}/api/query/study/all`;
    return this.http.get(url, this.userAuthRequestOptions());
  }

  getStudy(identifier: string) {
    const url = `${this.apiRoot}/api/query/study/one`;
    const options = {
      params: new HttpParams().set('identifier', identifier),
      ...this.userAuthRequestOptions()
    };
    return this.http.get(url, options);
  }

  getAllInstruments() {
    const url = `${this.apiRoot}/api/query/instrument/all`;
    return this.http.get(url, this.userAuthRequestOptions());
  }

  getInstrument(identifier: string) {
    const url = `${this.apiRoot}/api/query/instrument/one`;
    const options = {
      params: new HttpParams().set('identifier', identifier),
      ...this.userAuthRequestOptions()
    };
    return this.http.get(url, options);
  }

  getUid() {
    return this.uuid4();
  }

  addOperator(operator: Operator) {
    const url = `${this.apiRoot}/api/manage/create/operator`;
    return this.http.post(url, operator, this.userAuthRequestOptions());
  }

  updatePassword(newPassword: string) {
    const url = `${this.apiRoot}/api/manage/update/password`;
    return this.http.put(url, btoa(newPassword), this.userAuthRequestOptions());
  }

  addToken() {
    const url = `${this.apiRoot}/api/manage/create/token`;
    return this.http.post(url, null, this.userAuthRequestOptions());
  }

  addRole(role: Role) {
    const url = `${this.apiRoot}/api/manage/create/role`;
    return this.http.post(url, role, this.userAuthRequestOptions());
  }

  addEmailGroup(group: EmailGroup) {
    const url = `${this.apiRoot}/api/manage/create/email-group`;
    return this.http.post(url, group, this.userAuthRequestOptions());
  }

  addInstrument(instrument: Instrument) {
    const url = `${this.apiRoot}/api/manage/create/instrument`;
    return this.http.post(url, instrument, this.userAuthRequestOptions());
  }

  addLocation(location: Location) {
    const url = `${this.apiRoot}/api/manage/create/location`;
    return this.http.post(url, location, this.userAuthRequestOptions());
  }

  addStudy(study: Study) {
    const url = `${this.apiRoot}/api/manage/create/study`;
    return this.http.post(url, study, this.userAuthRequestOptions());
  }
}
