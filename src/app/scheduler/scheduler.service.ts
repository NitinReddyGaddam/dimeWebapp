import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';    

import { Global } from '../global';
import { formatDate } from '@angular/common';

@Injectable()
export class SchedulerService {

    constructor(private http: Http) { }

    

    getCoordList(uid: number): Observable<Response> {
        let body = { "uid": uid }
        return this.http.post(Global.COORD_LIST_URL, body);
    }

    getJobsList(body): Observable<Response> {
        return this.http.post(Global.JOBS_LIST_URL, body);
    }

    submitScheduleOpts(body): Observable<Response> {
        let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.SCHEDULER, body, options);
    }

    oozieOptions(body): Observable<Response> {
        let headers = new Headers({ "Content-Type": "application/json" });
		let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.OOZIEOPTIONS, body, options);
    }

    
}