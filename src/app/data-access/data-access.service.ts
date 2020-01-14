import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';

import { Global } from '../global';
import { formatDate } from '../../../node_modules/@angular/common';

@Injectable()
export class DataAccessService {

    constructor(private http: Http) { }

    stagingData(uId: number, bucket: String): Observable<Response> {
        let body = { "uid": uId };
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        if (bucket == "raw") {
            console.log("checking");
            return this.http.post(Global.DATA_ACCESS_BASE_URL + "/stagingRawData", body, options);
        }
        else if (bucket == "processed") {
            return this.http.post(Global.DATA_ACCESS_BASE_URL + "/stagingProcessedData", body, options);
        }
        else if (bucket == "landing") {
            return this.http.post(Global.DATA_ACCESS_BASE_URL + "/stagingLandingData", body, options);
        }
        console.log("abc hhjdjjkfkllf");


    }

    fetchStagingColumns(tname: String, level: Number) {
        let body = { "tname": tname, "level": level };
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DATA_ACCESS_BASE_URL + "/stagingColumns", body, options);
    }

    fetchMetadata(tname: String, level: Number) {
        let body = JSON.stringify({ "tname": tname, "tlevel": level });
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DATA_ACCESS_BASE_URL + "/metaData", body, options);
    }

    fetchTableInfo(tname: String, level: Number) {
        let body = JSON.stringify({ "tname": tname, "tlevel": level, "child": "child" });
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DATA_ACCESS_BASE_URL + "/details", body, options);
    }

    changeUserGroup(tname: String, group: String) {
        let body = JSON.stringify({ "tname": tname, "userGroup": group });
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DATA_ACCESS_BASE_URL + "/submitUserGroup", body, options);
    }

    getRecordCountGraph(tname: String, tlevel: Number, cname: String) {
        let body = JSON.stringify({ "tname": tname, "tlevel": tlevel, "cname": cname });
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DATA_ACCESS_BASE_URL + "/getRecordCountGraphJson", body, options);
    }

    getDistributionGraph(tname: String, tlevel: Number, cname: String) {
        let body = JSON.stringify({ "tname": tname, "tlevel": tlevel, "cname": cname });
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DATA_ACCESS_BASE_URL + "/getDistributionGraphJson", body, options);
    }

    getPatternGraph(tname: String, tlevel: Number, cname: String) {
        let body = JSON.stringify({ "tname": tname, "tlevel": tlevel, "cname": cname });
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DATA_ACCESS_BASE_URL + "/getPatternGraphJson", body, options);
    }
}