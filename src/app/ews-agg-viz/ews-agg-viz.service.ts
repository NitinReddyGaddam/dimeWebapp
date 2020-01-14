import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';

import { Global } from '../global';
import { formatDate } from '@angular/common';

@Injectable()
export class EWSAggVizService {
	constructor(private http: Http) { }

	modelList(): Observable<Response> {

		return this.http.get(Global.BASE_PATH + "/EWSAggModelList");
	}

	getPredictedData(model, months): Observable<Response> {

		let body = { "model": model, "months": months }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(Global.BASE_PATH + '/EWSAggPred', body, options);
	}


}