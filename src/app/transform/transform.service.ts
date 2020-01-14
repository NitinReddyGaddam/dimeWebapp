import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable, Subscriber } from 'rxjs';


import { Global } from '../global';

@Injectable()
export class TransformService {

    constructor(private http: Http) { }

    getMetadata(tname: String, tlevel: String): Observable<Response> {
        console.log("inside metadataservice");
        let body = { "tname": tname, "tlevel": tlevel };
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/metaData", body, options);
    }

    getPreviewdata(tname: String, tlevel: String): Observable<Response> {
        console.log("inside previewdataservice");
        let body = { "tname": tname, "tlevel": tlevel };
        let body1 = JSON.stringify(body);
        console.log("inside preview body" + body1);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/preview", body, options);
    }

    getCodeRepoDetails(): Observable<Response> {
        console.log("inside CodeRepoDetails");
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/codeRepoDetails", options);
    }

    getVersions(fName): Observable<Response> {
        let body = { 'fName': fName };
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/FileVersions", body, options);
    }

    getScriptOnTblName(body): Observable<Response> {
        console.log("inside getScriptontbl service");


        let strbody = JSON.stringify(body);
        console.log(strbody);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/DisplayItem", body, options);

    }


    getScriptOnVersion(body): Observable<Response> {
        console.log("inside getScriptonversion service");
        let strbody = JSON.stringify(body);
        console.log(strbody);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/DisplayItem", body, options);

    }
    getFlowList(uid: number): Observable<Response> {
        let body = { "uid": uid }
        console.log("getjoblist " + body);
        return this.http.post(Global.JOBS_FLOW_URL, body);
    }

    fetchUserTablesForLineage(uid: number): Observable<Response> {
        let body = { "uid": uid };
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/fetchUserTablesForLineage", body, options);
    }

    fetchLineage(uid, flowId): Observable<Response> {
        let body = { "uid": uid, "flowId": flowId };
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/fetchLineageJson", body, options);
    }

    fetchLineageOnTbl(uid, parentLeng): Observable<Response> {
        let body = { "uid": uid, "parentLeng": parentLeng };
        let body1 = JSON.stringify(body);
        console.log("body1" + body1);
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/fetchLineageJson", body, options);
    }

    copy_pipelineService(uid, tname, destTableName, tbComments): Observable<Response> {
        let body = {
            "iscopyPipeLine": "copyPipeLine",
            "sourceTableName": tname,
            "destTableName": destTableName,
            "tbComments": tbComments,
            "isHive": "hive",
            "uid": uid
        }

        let body1 = JSON.stringify(body);
        console.log("body1" + body1);
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/jobCreation", body, options);
    }
    zappleinConnect(jsonBody): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body = jsonBody;
        let body1 = JSON.stringify(body);
        console.log("body" + body1);
        return this.http.post(Global.BASE_PATH + "/zappelinConnect", body, options);
    }

    addFile(body): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body1 = JSON.stringify(body);
        console.log("body1" + body1);
        return this.http.post(Global.BASE_PATH + "/AddFile", body, options);
    }

    getTableView(body): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body1 = JSON.stringify(body);
        console.log("body1" + body1);
        return this.http.post(Global.BASE_PATH + "/fetchLineageJson", body, options);
    }

    codeCheckIn(jsonBody): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body = jsonBody;
        let body1 = JSON.stringify(body);
        console.log("body" + body1);
        return this.http.post(Global.BASE_PATH + "/GitCommit", body, options);
    }

    findAndReplace(body): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        console.log("inside service", body);
        return this.http.post(Global.FIND_AND_REPLACE_END_POINT, JSON.stringify(body), options);
    }

    dateFilter(request): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DATE_AND_FILTER_END_POINT, request, options);
    }

    concatColumn(request): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.CONCAT_COLUMNS_END_POINT, request, options);
    }

    numberFilter(request): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.NUMBER_FILTER_END_POINT, request, options);
    }

    wrangleTablesList(request): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body = { "flowId": request };
        console.log("inside servie flowid", body);
        return this.http.post(Global.BASE_PATH + '/quickWranglingTbls', body, options);
    }

    previewJoinedData(body): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + '/previewWrangledData', body, options);
    }

    createWrangleTable(body): Observable<Response> {
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + '/createWrangledTbl', body, options);
    }
}