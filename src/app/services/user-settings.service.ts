import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {CollectionName} from '../models/parameter.model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  setting: any;
  crypto: any;
  algorithm = 'aes-256-ctr';
  password = 'labpipe-piKachu-ThunDerBolt';
  key: any;
  cipher: any;
  decipher: any;
  iv: any;
  path: any;
  fs: any;

  constructor(
    private es: ElectronService
  ) {
    this.setting = this.es.remote.require('electron-settings');
    this.path = this.es.remote.require('path');
    this.fs = this.es.remote.require('fs-extra');
  }

  setParameter(p: string, v: any): void {
    this.setting.set(p, v);
  }

  getParameter(p: string, d?: any): any {
    return d ? this.setting.get(p, d) : this.setting.get(p);
  }

  setStartupMode(regular: boolean): void {
    this.setParameter('regular-startup', regular);
  }

  getStartupMode(): boolean {
    return this.getParameter('regular-startup');
  }

  setApiToken(v: string): void {
    this.setParameter('api_token', v);
  }

  getApiToken(): string {
    return this.getParameter('api_token');
  }

  setApiKey(v: string): void {
    this.setParameter('api_key', v);
  }

  getApiKey(): string {
    return this.getParameter('api_key');
  }

  setDataDirectory(path: string): void {
    this.setParameter('config_data_directory', path);
    const fileDir = this.path.join(path, 'files');
    this.setFileDirectory(fileDir);
  }

  getDataDirectory(): string {
    return this.getParameter('config_data_directory');
  }

  setFileDirectory(path: string): void {
    this.fs.ensureDir(path).then(() => {
      this.setParameter('config_file_directory', path);
    })
      .catch(err => {
        console.log(err);
        throw new Error('Cannot ensure files directory.');
      });
  }

  getFileDirectory(): string {
    return this.getParameter('config_file_directory');
  }

  setApiRoot(v: string): void {
    this.setParameter('api_root', v);
  }

  getApiRoot(): string {
    return this.getParameter('api_root');
  }

  setServerMonitorInterval(interval: number) {
    this.setParameter('server_monitor_interval', interval);
  }

  getServerMonitorInterval() {
    return this.getParameter('server_monitor_interval', 30000);
  }

  updateServerMonitorRetryInterval(interval: number) {
    this.setParameter('server_monitor_retry_interval', interval);
  }

  getServerMonitorRetryInterval() {
    return this.getParameter('server_monitor_retry_interval', 1000);
  }

  getOperators(): any[] {
    return this.getParameter(CollectionName.OPERATORS);
  }

  getCollectors(): any[] {
    return this.getParameter(CollectionName.COLLECTORS);
  }

  setLocation(v: any): void {
    this.setParameter('location', v);
  }

  getLocation(): any {
    return this.getParameter('location');
  }

  setInstrument(v: any): void {
    this.setParameter('instrument', v);
  }

  getInstrument(): any {
    return this.getParameter('instrument');
  }

  getInstruments(): any[] {
    return this.getParameter(CollectionName.INSTRUMENTS);
  }

  getStudies(): any[] {
    return this.getParameter(CollectionName.STUDIES);
  }

  getLocations(): any[] {
    return this.getParameter(CollectionName.LOCATIONS);
  }

  getForms(): any {
    return this.getParameter(CollectionName.FORMS, {});
  }

  setForm(v: any) {
    this.setParameter(`${CollectionName.FORMS}.${v.identifier}`, v);
  }

  getForm(studyIdentifier: string, instrumentIdentifier: string) {
    return Object.values(this.getForms()).filter((f: any) => f.studyIdentifier === studyIdentifier && f.instrumentIdentifier === instrumentIdentifier);
  }

  getFormWithIdentifier(identifier: string) {
    if (this.setting.has(`${CollectionName.FORMS}.${identifier}`)) {
      return this.getParameter(`${CollectionName.FORMS}.${identifier}`);
    }
  }
}
