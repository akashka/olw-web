import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Auth } from '../auth/auth';
import 'rxjs/add/operator/map';

@Injectable()
export class Indentation {

  url = "https://spark-olw.herokuapp.com/";
  // url = "http://localhost:8080/";
 
  constructor(public http: Http, public authService: Auth) {
 
  }
 
  // Function to get list of al the Indentations
  searchIndentation(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Authorization', this.authService.storage.token);
      this.http.get(this.url+'api/indentations', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          if(err.status == 401) this.authService.logout();
          reject(err);
        });
    });
  }
 
  createIndentation(indentation){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authService.storage.token);
      this.http.post(this.url+'api/indentations', JSON.stringify(indentation), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          if(err.status == 401) this.authService.logout();
          reject(err);
        });
    });
  }
 
  updateIndentation(indentation){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Authorization', this.authService.storage.token);
        this.http.put(this.url+'api/indentations/' + indentation._id, indentation, {headers: headers})
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