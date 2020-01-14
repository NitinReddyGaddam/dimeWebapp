import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';

import { Global } from '../global';
import { formatDate } from '@angular/common';

@Injectable()
export class IceVisualizationService {
	constructor(private http: Http) { }
	getWordList(): Observable<Response> {
		return this.http.post(Global.ICE_COL_LIST, null);
	}

	getChartJson(material: string): Observable<Response> {
		let body = { "material": material }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		console.log(this.http.post(Global.ICE_DATA_JSON, body, options));
		return this.http.post(Global.ICE_DATA_JSON, body, options);
	}

	getTblData(material: string, wordMatch: string, selSegment: string, selClass: string, selFamily): Observable<Response> {
		let body = { "material": material, "wordMatch": wordMatch, "selSegment": selSegment, "selClass": selClass, "selFamily": selFamily }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		console.log(this.http.post(Global.ICE_TBL_DATA, body, options));
		return this.http.post(Global.ICE_TBL_DATA, body, options);
	}

	setUnspcTitle(material: string, unspcTitle: string, selSegment: string, selClass: string, selFamily): Observable<Response> {
		let body = { "material": material, "unspcTitle": unspcTitle, "selSegment": selSegment, "selClass": selClass, "selFamily": selFamily }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		console.log(this.http.post(Global.SET_UNSPC_TITLE, body, options));
		return this.http.post(Global.SET_UNSPC_TITLE, body, options);
	}

	checkUnspcTitle(material: string): Observable<Response> {
		console.log("selected input in service" + material);
		let body = { "material": material }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		console.log(Global.BASE_PATH + '/dime-app-dev/CheckExistenceOfRecord?material=' + material);
		return this.http.post(Global.BASE_PATH + '/CheckExistenceOfRecord', body, options);
	}

	getSegment(material: string, wordMatch: string): Observable<Response> {
		console.log("entered service");
		let body = { "material": material, "wordMatch": wordMatch }
		// let kjdkf=JSON.stringify(body);
		// console.log(kjdkf);
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		console.log(this.http.post(Global.ICE_SEGMENT, body, options));
		return this.http.post(Global.ICE_SEGMENT, body, options);
	}

	getClass(material: string, wordMatch: string, selSegment: string): Observable<Response> {
		let body = { "material": material, "wordMatch": wordMatch, "selSegment": selSegment }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(Global.ICE_CLASS, body, options);
	}

	getFamily(material: string, wordMatch: string, selSegment: string, selClass: string): Observable<Response> {
		let body = { "material": material, "wordMatch": wordMatch, "selSegment": selSegment, "selClass": selClass }
		let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(Global.ICE_FAMILY, body, options);
	}
}