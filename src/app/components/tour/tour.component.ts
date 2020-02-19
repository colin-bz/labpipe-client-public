import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as introJs from 'intro.js/intro.js';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  introJS: any;

  @Input() tour: string;
  @Output() signal = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  getIntroOptions() {
    switch (this.tour) {
      case 'login-page':
        return {
          steps: [
            {
              intro: 'You are now at the login-page page.'
            },
            {
              element: '#tour-select-location',
              intro: 'Please select an option matching your current operating site.'
            },
            {
              element: '#tour-select-instrument',
              intro: 'Please select an option matching your current operating instrument.'
            },
            {
              element: '#tour-user-id',
              intro: 'Please enter your allocated username for login-page.'
            },
            {
              element: '#tour-user-password',
              intro: 'Please enter your password.'
            },
            {
              element: '#tour-confirm-login-page',
              intro: 'Once you have completed all fields above, the login-page button will be enabled for you to continue.'
            }
          ]
        };
      case 'settings':
        return {
          steps: [
            {
              intro: 'You are now at the general settings page.'
            },
            {
              element: '#tour-data-directory',
              intro: 'Please select the directory where your record data and files can be locally saved to.'
            },
            {
              element: '#tour-api-root',
              intro: 'Please enter corresponding LabPipe server host address, then click validate to check the connection.'
            },
            {
              element: '#tour-api-token',
              intro: 'Please enter your allocated access token and key, then click validate to check the connection.'
            },
            {
              element: '#tour-monitor-interval',
              intro: 'This is how frequent the tool checks connection to the server. Please note this is in milliseconds.'
            },
            {
              element: '#tour-retry-interval',
              intro: 'This is how frequent the tool retries connection to the server when there is difficulty. ' +
                'Please note this is in milliseconds.'
            }
          ]
        };
      case 'tasks':
        return {
          steps: [
            {
              intro: 'You are now at the tasks portal.'
            },
            {
              element: '#tour-select-study',
              intro: 'Please select a study, then click start to continue. ' +
                'It will then redirect you to proceed with linked form, ' +
                'or prompt you for choice if multiple forms are available, ' +
                'or redirect you back to the portal if no form is available.'
            }
          ]
        };
      case 'browse':
        return {
          steps: [
            {
              intro: 'You are now at the record browsing portal.'
            },
            {
              element: '#tour-remote-records',
              intro: 'Here shows records that can be retrieved from remote server.'
            },
            {
              element: '#tour-remote-retry',
              intro: 'Click here to re-attempt loading data from remote server.'
            },
            {
              element: '#tour-remote-action',
              intro: 'Click here to perform different actions on selected record.'
            },
            {
              element: '#tour-local-records',
              intro: 'Here shows records that can are saved locally.'
            },
            {
              element: '#tour-local-retry',
              intro: 'Click here to re-attempt loading data from local database.'
            },
            {
              element: '#tour-local-action',
              intro: 'Click here to perform different actions on selected record.'
            }
          ]
        };
    }
  }

  startTour() {
    const option = this.getIntroOptions();
    this.introJS = introJs().oncomplete(() => this.signal.emit(false))
      .onexit(() => this.signal.emit(false));
    this.introJS.setOptions(option);
    this.introJS.start();
    this.signal.emit(true);
  }

}
