import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';

import { Global } from '../global';
import { formatDate } from '@angular/common';

@Injectable()
export class HeaderService {
	constructor(private http: Http) { }

	iceExistanceForUser(uid: string): Observable<Response> {
		let body = { "uid": uid }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		console.log(this.http.post(Global.ICE_DATA_JSON, body, options));
		return this.http.post(Global.BASE_PATH + "/validateIceFlow", body, options);
	}

	iceVizExistanceForUser(uid: string): Observable<Response> {
		let body = { "uid": uid }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		console.log(this.http.post(Global.ICE_DATA_JSON, body, options));
		return this.http.post(Global.BASE_PATH + "/validateVizualization", body, options);
	}

}