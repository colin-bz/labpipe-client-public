import { Component, OnInit } from '@angular/core';
import {ShareDataService} from '../../services/share-data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.css']
})
export class NoAccessComponent implements OnInit {

  constructor(private sds: ShareDataService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.sds.resetLogin();
    this.router.navigate(['user-login']);
  }

}
