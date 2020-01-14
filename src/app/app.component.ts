import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './route-auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  headerVisible: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.headerVisible = this.authService.loggedIn;
  }

  headerShow() {
    this.router.events.subscribe((event) => {
      if (event["url"] == "/login" || event["url"] == "/") {
        this.headerVisible = this.authService.isLoggedIn;
      }
      else {
        this.headerVisible = this.authService.isLoggedIn;
      }
    });
  }

}
