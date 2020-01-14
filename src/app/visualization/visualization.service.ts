import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';

import { Global } from '../global';
import { formatDate } from '../../../node_modules/@angular/common';

@Injectable()
export class VisualizationService {
	constructor(private http: Http) { }
	getTableList(uid: number): Observable<Response> {
		let body = { "uid": uid }
		return this.http.post(Global.VIZ_TBL_LIST, body);;
	}

	getColList(tname: string, level: string): Observable<Response> {
		let body = { "tname": tname, "level": level }
		return this.http.post(Global.VIZ_COL_LIST, body);
	}

	getChartDetails(tname: string, tlevel: string, xColumn: string, yColumn: string, chartType: string, aggType: string): Observable<Response> {
		let body = { "tname": tname, "tlevel": tlevel, "xColumn": xColumn, "yColumn": yColumn, "chartType": chartType, "aggType": aggType }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(Global.VIZ_CHARTS, body, options);
	}
}