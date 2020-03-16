import React from 'react';
import {BehaviorSubject} from "rxjs";

class ShareDataService extends React.Component {
    operator: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
    password: BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);
    location: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
    instrument: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
    study: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

    connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
