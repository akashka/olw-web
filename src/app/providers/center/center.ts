import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Auth } from '../auth/auth';
import 'rxjs/add/operator/map';

@Injectable()
export class Center {

  url = "https://spark-olw.herokuapp.com/";
  // url = "http://localhost:8080/";

  constructor(public http: Http, public authService: Auth) {
 
  }
 
  // Function to get list of al the centers
  searchCenter(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Authorization', this.authService.storage.token);
      this.http.get(this.url+'api/centers', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          if(err.status == 401) this.authService.logout();
          reject(err);
        });
    });
  }
 
  createCenter(center){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authService.storage.token);
      this.http.post(this.url+'api/centers', JSON.stringify(center), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          if(err.status == 401) this.authService.logout();          
          reject(err);
        });
    });
  }
 
  updateCenter(center){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Authorization', this.authService.storage.token);
        this.http.put(this.url+'api/centers/' + center._id, center, {headers: headers})
          .map(res => res.json())
          .subscribe((res) => {
            resolve(res);
          }, (err) => {
            if(err.status == 401) this.authService.logout();            
            reject(err);
          });    
    });
  }
 
}