import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';    

import { Global } from '../global';
import { formatDate } from '../../../node_modules/@angular/common';

@Injectable()
export class DataIngestionService {

    constructor(private http: Http) { }

    kafkaIngest(ingestData): Observable<Response> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/kafkaIngest", ingestData, options);
    }

    getJobsList(uid: number): Observable<Response> {
        let body = { "uid": uid }
        return this.http.post(Global.JOBS_LIST_URL, body);
    }

    deploy(jobId: number, uId : number): Observable<Response> {
        let body = { "jobId": jobId , "uid": uId};
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.DEPLOY_URL, body, options);
    }

    execute(jobId: number, uid: number): Observable<Response> {
        let body = { "jobId": jobId, "uid": uid };
        return this.http.post(Global.EXECUTE_URL, body);
    }

    fetchTablesList(formValue: any): Observable<Response> {
        let body = JSON.stringify(formValue);
        console.log("body: ", body);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.TABLES_LIST_URL, body, options);
    }

    fetchSchemaList(formValue: any): Observable<Response> {
        let body = JSON.stringify(formValue);
        console.log("inside fetch schema");
        console.log("body: ", body);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.SCHEMAS_LIST_URL, body, options);
    }

    fetchColumnsList(formValue: any): Observable<Response> {
        let body = JSON.stringify(formValue);
        console.log("body: ", body);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.COLUMNS_LIST_URL, body, options);
    }

    createJob(content: { any }): Observable<Response> {
        console.log("content : ", content);
        let body = JSON.stringify(content);
        console.log("body: ", body);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.JOBS_CREATE_URL, body, options);
    }

    getColumns(jobId: number, uId: number): Observable<Response> {

        let body = { "jobId": jobId, "uId": uId }
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.IncrimentalColumns_URL, body, options);
    }
    postreRun(body): Observable<Response> {
        console.log("inside rerun");
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        console.log("inside run" + body);
        return this.http.post(Global.RERUN_URL, body, options);

    }

    uploadCSV(fileToUpload: File): Observable<Response> {
        console.log("Inside Upload File");
        var formData: FormData = new FormData();
        formData.append("file", fileToUpload);
        return this.http.post(Global.File_Upload_URL, formData);

    }

    createCSVJob(fileToUpload: File, columns: any, uId: any, comments: any, description: any, workflowType: any): Observable<Response> {
        console.log("Inside create csv job");
        var formData: FormData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("jsonString", columns);
        formData.append("uid", uId);
        formData.append("comments", comments);
        formData.append("description", description);
        formData.append("workflowType", workflowType);
        console.log(formData.getAll("jsonString"), formData.getAll("file"), formData.getAll("uid"), formData.getAll("description"), formData.getAll("workflowType"));
        return this.http.post(Global.CREATE_CSV_JOB_URL, formData);
    }

    fetchLineage(uid, flowId): Observable<Response> {
        let body = { "uid": uid, "flowId": flowId };
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/fetchLineageJson", body, options);
    }

    fetchFiles(): Observable<Response> {
        console.log("ho");

        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(Global.BASE_PATH + "/getListofLargeFileItems");
    }

    sendFilestoBeCopiedToHDFS(pBody) {
        let body = pBody;
        let body1 = JSON.stringify(body);

        console.log("body: " + body1);
        let headers = new Headers({ "content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Global.BASE_PATH + "/copyFilesToHdfs", body, options);
    }
}