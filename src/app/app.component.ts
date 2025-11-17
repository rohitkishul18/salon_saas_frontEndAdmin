import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // isLoggedIn = false;

  // constructor(private router: Router) {}

  ngOnInit() {
  //   this.checkLogin();

  //   // Update isLoggedIn on route change
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.checkLogin();
  //     }
  //   });
  // }

  // checkLogin() {
  //   const token = localStorage.getItem('token');
  //   this.isLoggedIn = !!token;
  }
}
