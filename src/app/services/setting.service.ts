import { Injectable } from '@angular/core';
import {JSONSchema, StorageMap} from '@ngx-pwa/local-storage';
import {NzMessageService} from 'ng-zorro-antd';
import {BehaviorSubject, Observable} from 'rxjs';
import {JSONSchemaBoolean} from '@ngx-pwa/local-storage/lib/validation/json-schema';
import {CollectionName} from '../models/parameter.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private storage: StorageMap,
              private nzm: NzMessageService) { }

  setSetting(k: string, v: any) {
    this.storage.set(k, v).subscribe({
      next: () => {
      },
      error: (error) => {
        this.nzm.error(`Error saving setting with key [${k}]. Check console log.`);
        console.log(error);
      },
    });
  }

  getOperators(): Observable<unknown> {
    return this.storage.get(CollectionName.OPERATORS);
  }
}
