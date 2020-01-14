import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';

import { Global } from '../global';
import { formatDate } from '@angular/common';

@Injectable()
export class EWSVehVizService {
	constructor(private http: Http) { }

	getVehPredictedData(count): Observable<Response> {

		let body = { "count": count }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(Global.BASE_PATH + '/EWSVehPred', body, options);
	}

}