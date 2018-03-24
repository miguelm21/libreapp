import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { JwtHelper } from "angular2-jwt";
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  jwtHelper = new JwtHelper();
  Email: any;
  Password: any;
  token;
  error: string;

  private LOGIN_URL = "http://librepaper.com/app/auth";

  constructor(
  	public navCtrl: NavController,
  	public http: Http,
    public storage: Storage) {

  }

  login(){
  	let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var credentials = JSON.stringify({email: this.Email, password: this.Password});
    this.http.post(this.LOGIN_URL, credentials, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => { 
          this.authSuccess(data.token);
          let headers2 = new Headers();
          headers2.append('Authorization', 'Bearer ' + data.token);
        },
        err => { 
          if (err.status == 401){
            alert('Credenciales Incorrectas');
          } else if (err.status == 400) {
            alert('Su usuario ha sido deshabilitado');
          } else if (err.status == 500) {
            alert('Ocurrio un error');
          }
        },
      );
  }

  authSuccess(token) {
    this.error = null;
    this.storage.set('token', token);
    this.token = token;
    var sub = this.jwtHelper.decodeToken(token).sub;
    this.storage.set('profile', sub);
  }

}
