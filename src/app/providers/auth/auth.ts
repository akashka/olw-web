import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

@Injectable()
export class Auth {

  public token;
  url = "https://spark-olw.herokuapp.com/";
  // url = "http://localhost:8080/";
  storage = window.localStorage; 

  public static userChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(public http: Http, private router: Router) {

  }

  checkAuthentication() {
    return new Promise((resolve, reject) => {
      //Load token if exists
      this.token = this.storage.getItem('token');
      //"JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsImVtYWlsIjoiYW5pbGtzLnNoYXJtYUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJjZW50ZXIiOiJIRU8iLCJuYW1lIjoiQW5pbCBTaGFybWEiLCJfaWQiOiI1OTdkZGM0MmFiODMyYTA3ODEzZTUzNzMiLCJpYXQiOjE1NDcxMTkzODcsImV4cCI6MTU0NzEyOTQ2N30.tIpc7ImjI6Xs7Y7lhb1RCTIDr4N18XlIrMRzNDnDSDg";
      let headers = new Headers();
      headers.append('Authorization', this.token);
      Auth.userChanged.next(JSON.parse(this.storage.getItem('user')));
      this.http.get(this.url + 'api/auth/protected', { headers: headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  createAccount(details) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.url + 'api/auth/register', JSON.stringify(details), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          this.token = data.token;
          resolve(data);
        }, (err) => {
          if(err.status == 401) this.logout();          
          reject(err);
        });
    });
  }

  updateAccount(details) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.url + 'api/auth/update', JSON.stringify(details), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          this.token = data.token;
          resolve(data);
        }, (err) => {
          if(err.status == 401) this.logout();          
          reject(err);
        });
    });
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.url + 'api/auth/login', JSON.stringify(credentials), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          this.token = data.token;
          if (data.user) {
            this.storage.setItem('token', data.token);
            this.storage.setItem('user', JSON.stringify(data.user));
            Auth.userChanged.next(data.user);
          }
          resolve(data);
          resolve(res.json());
        }, (err) => {
          if(err.status == 401) this.logout();          
          reject(err);
        });
    });
  }

  forgotPassword(credentials) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.url + 'api/auth/forgotPassword', JSON.stringify(credentials), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          resolve(data);
        }, (err) => {
          if(err.status == 401) this.logout();          
          reject(err);
        });
    });
  }

  searchUser() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.url + 'api/auth', { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          if(err.status == 401) this.logout();          
          reject(err);
        });
    });
  }

  logout() {
    this.storage.setItem('token', '');
    this.storage.setItem('user', JSON.stringify({}));
    this.router.navigate(['./auth']);
    Auth.userChanged.next(true);
  }

  deleteAccount(details) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.url + 'api/auth/delete', JSON.stringify(details), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          this.token = data.token;
          resolve(data);
        }, (err) => {
          if(err.status == 401) this.logout();
          reject(err);
        });
    });
  }

}