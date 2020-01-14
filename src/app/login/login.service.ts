import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';

import { Global } from '../global';

@Injectable()
export class LoginService {

    constructor(private http: Http) { }

    login(formValue: any): Observable<Response> {
        let body = JSON.stringify(formValue);
        console.log("body: ", body);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.LOGIN_URL, body, options);
    }
}