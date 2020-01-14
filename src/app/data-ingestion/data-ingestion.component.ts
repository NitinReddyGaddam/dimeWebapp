import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FilterPipe } from './filter.pipe';
import { OrderByPipe } from './sorting.pipe';
import { PaginationService } from '../pagination.service';
import "../../assets/js/d3.v3.min.js";
import { ViewEncapsulation } from '@angular/core';
import { DataIngestionService } from './data-ingestion.service';
import * as _ from 'underscore';
import { CommonService } from '../services/common.service';
import { ResolvedReflectiveProvider_ } from '@angular/core/src/di/reflective_provider';
import "../../assets/js/select2.js";
import { DeclareFunctionStmt } from '@angular/compiler';
import { bind } from '@angular/core/src/render3/instructions';
declare var $: any;
declare var d3: any;

@Component({
    selector: 'section-content',
    encapsulation: ViewEncapsulation.Emulated,
    templateUrl: './data-ingestion.component.html',
    styleUrls: ['../../assets/css/data-ingestion.css', '../../assets/css/style.css'],
    providers: [DataIngestionService, OrderByPipe, PaginationService, FilterPipe]
})
export class DataIngestionComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    exStatus = [];
    depStatus = [];
    reStatus = [];
    jobsList: Array<any>;
    tempJobsList: Array<any>;
    search: any;
    sortDirection: boolean = false;
    displayLimit: number = 10;
    connectAndResetForm: FormGroup;
    resetConnectForm: boolean = false;
    connectSuccess: boolean = false;
    connectError: boolean = false;
    tablesList: Array<any>;
    tempTablesList: Array<any>;
    connectFormValue: any;
    searchTable: any;
    searchColumn: any;
    selectedColumnsArray: Array<any> = [];
    jobstatus: number;
    //executeStatus: number;
    createTable: any;
    selectedColumnsCount: number;
    createTableJson: any = {};
    comments: any;
    jobCount: number;
    radioSelected: String = "TruncateAndLoad";
    private rerunStatus;
    private colDataType;
    private columnName;
    jobId: number;
    public display: boolean = false;
    public columnsList;
    userId;
    fileToUpload: File = null;
    timeseriesFileToUpload: File = null;
    csvColumns = [];
    timeseriescsvColumns = [];
    csvComments = '';
    timeseriesCSVComments = '';
    csvName = "Choose file to upload";
    timeseriesCSVname = "Choose file to upload";
    csvJSON: Array<any>;
    private rerunResponse;
    private lineageGraphCount;
    private divGraphNameList = [];
    showLoader: boolean = false;
    showHorizontalLoader: boolean = false;
    private columnSelected: boolean = false;
    private isDestTableNameAbsent: boolean = false;
    private columnNotSelectedMesg: boolean = false;
    private destTblNotMentionedMesg: boolean = false;
    private tablesSelected = [];
    private showDateFormats: boolean = false;
    private fileLocation;
    private frequency;
    private fileType = null;
    private count = 0;
    private showMultitable: boolean = true;
    private multitableValue: boolean = false;
    private jobClickCount = 0;
    private showSubJob: boolean = false;
    private selectedJob;
    private columnSelErr: boolean = false;
    private fileNameToIngested;
    private fileSelect;
    private selectedFiles = { "uid": this.userId, "fileList": [],"jobName":"" };
    private ingestErr: boolean = false;
    private ingestSubmitted: boolean = false;
    private ingErr: boolean = true;
    private showHorizLoder: boolean = false;
    private workflowType = 'regular';
    dbSchemas = [];
    radioVal ="hbase";
    @ViewChild("largeDataForm") largeDataForm: NgForm;
    private largefileDataResponse={};


    constructor(private commonServices: CommonService, private route: ActivatedRoute, private orderByPipe: OrderByPipe, private filterPipe: FilterPipe, private paginationService: PaginationService, private dataIngestionService: DataIngestionService) { }

    ngOnInit() {
        this.userId = localStorage.getItem('uId');
        this.fetchJobsList();
        this.initConnectForm();
        var that=this;
        $("#dbSchemas").select2({
            width: 'resolve', // need to override the changed default
            placeholder: 'Select an option'
        }).on("change", function (e) {
            console.log("after change", $("#dbSchemas option:selected").length);
            if($("#dbSchemas option:selected").length !=0   )
            {
                that.connectAndResetForm.controls["dbSchemas"].setErrors(null);
                console.log("setting errors null");
            }
            else 
            {
                that.connectAndResetForm.controls["dbSchemas"].setErrors({'incorrect': true});
                console.log("setting errors null");
            }
      });
    }

    ngAfterViewInit() {

    }

    submitlargeData() {

        this.ingestSubmitted = true;
        this.selectedFiles.uid = this.userId;
        this.selectedFiles.jobName = this.jobNameForLargeFile;
        for (let i in this.fileNameToIngested) {
            if (this.fileNameToIngested[i].selected) {
                this.selectedFiles.fileList.push(this.fileNameToIngested[i].fileName);
            }
        }
        let filess = JSON.stringify(this.selectedFiles);
        if (this.selectedFiles.fileList.length > 0) { this.ingestErr = false }
        else { this.ingestErr = true };
        if (this.ingestSubmitted && !this.ingestErr) {
            this.sendSelectedFiles();
        }
    }
    sendSelectedFiles() {
        this.showHorizLoder = true;
        $("#submitLargeData").attr('disabled', true);
        this.dataIngestionService.sendFilestoBeCopiedToHDFS(this.selectedFiles).subscribe((Response: any) => {
            this.showHorizLoder = false;
            var response = JSON.parse(Response._body);
            console.log(response);
            if (response.status.toLowerCase() == 'filesmoved') {
                $("#largeData-action .action-icon.failure").removeClass("failure").addClass("success");
                $("#largeData-action .action-text").find("span").text("Files moved successfully");
                $("#largeData").find("#largeData-action").show();
                this.fetchJobsList();
                this.largefileDataResponse = response;
                this.largeFileDataDestPath = response;

                $("#largeData").modal("hide");
                $("#largeDataResponse").modal("show");
            }
            else {
                $("#largeData-action .action-icon.success").removeClass("success").addClass("failure");
                $("#largeData #largeData-action .action-text").find("span").text("Files were not moved to HDFS");
                $("#largeData").find("#largeData-action").show();
            }
        }, (err: any) => {
            this.showHorizLoder = false;
        })

    }
    checkFile(event, fileSelect) {

        let event1 = JSON.stringify(event);

        for (let i in this.fileNameToIngested) {
            if (this.fileNameToIngested[i].fileName == fileSelect) {
                this.fileNameToIngested[i].selected = event;
            }
        }

        let filesSelectedtest = JSON.stringify(this.fileNameToIngested);
        for (let i in this.fileNameToIngested) {
            if (this.fileNameToIngested[i].selected == false) {

                this.ingErr = true;
            }
        }
        for (let i in this.fileNameToIngested) {
            if (this.fileNameToIngested[i].selected) {
                this.ingErr = false;
            }
        }
        if (this.ingErr) {
            this.ingestErr = true;
        }
        else {
            this.ingestErr = false;
        }

    }

    closeIngest() {

    }
    openIngestLargeData() {
        // this.largeDataForm.resetForm();
        $("#largeData-action").hide();
        this.ingestSubmitted = false;
        this.ingestErr = false;
        $("#submitLargeData").attr('disabled', false);
        this.selectedFiles = { "uid": this.userId, "fileList": [],"jobName":"" };
        for (let i in this.fileNameToIngested) {
            this.fileNameToIngested[i].selected = false;
        }
        this.dataIngestionService.fetchFiles().subscribe((Response: any) => {
            let response = Response.json();
            for (let i in response) {
                response[i]["selected"] = false;
            }


            this.fileNameToIngested = response;
        })


        $("#createjobs").modal("hide");
        $("#largeData-action").hide();
        $("#largeData").modal("show");

    }
    getFileType(fileType) {
        this.fileType = fileType;
    }

    openStreamPopup() {
        $("#createjobs").modal("hide");
        $("#stream-action").hide();
        $("#stream").modal("show");
    }

    submitStream() {
        let body = {
            "userId": 1,
            "fileLocation": "C:\\Users\\311911\\Pictures\\Sample_Data_small\\",
            "fileType": ".txt",
            "frequency": "30"

        }
        let body1 = {
            "userId": 1,
            "fileLocation": this.fileLocation,
            "fileType": this.fileType,
            "frequency": this.frequency
        }
        this.dataIngestionService.kafkaIngest(body1).subscribe((Response: any) => {
            let data = Response.json();
            if (((data.statusMessage).toLowerCase().indexOf('success')) != -1) {
                $("#stream-action .action-icon.failure").removeClass("failure").addClass("success");
                $("#stream-action .action-text").find("span").text(data.statusMessage);
                $("#stream").find("#stream-action").show();
            }
            else {
                $("#largeData-action .action-icon.success").removeClass("success").addClass("failure");
                $("#stream #stream-action .action-text").find("span").text(data.statusMessage);
                $("#stream").find("#stream-action").show();
            }

        })
    }
    showLineage(flowId) {
        $(".lineage-wrapper-dataIngestionPage .lineage-diagram").empty();
        this.dataIngestionService.fetchLineage(this.userId, flowId).subscribe((Response: any) => {
            let data = Response.json();
            let data1 = JSON.stringify(data[0]);
            console.log("data1: " + data1);
            this.getGraphWithData(data);
        })
    }

    getGraphWithData(data) {
        let dataWithDummynode = {
            "name": "root-node",
            "id": "root-node",
            "children": data
        };

        console.log("data3" + JSON.stringify(dataWithDummynode))
        console.log("data1: " + JSON.stringify(dataWithDummynode));
        // this.lineageGraphCount = dataWithDummynode.length;
        // console.log(this.lineageGraphCount);

        // for (let j = 0; j < this.lineageGraphCount; j++) {

        this.getLineage(dataWithDummynode);

        // }
    }
    fetchJobsList() {
        this.showLoader = true;
        this.dataIngestionService.getJobsList(this.userId).subscribe((Response: any) => {
            this.showLoader = false;
            this.jobsList = Response.json();
            console.log("jobslist", this.jobsList);

            for (let eachJson of this.jobsList) {
                eachJson["showSubJobs"] = false;
            }
            console.log("inside fetch jobs", this.jobsList);
            this.jobCount = this.jobsList.length;
            console.log("JobList: ", this.jobsList);
            this.tempJobsList = this.jobsList;
            this.setActivePage(1, this.displayLimit);
        }, (err: any) => {
            this.showLoader = false;
        });
    }

    // pagination for chargeable
    private activePager: any = {};
    paginationLength: number = 10;

    setActivePage(page: number, pageNum) {
        this.activePager = {};
        if (page < 1 || page > this.activePager.totalPages) {
            return;
        }
        // get pager object from service
        this.activePager = this.paginationService.getPager(this.tempJobsList.length, page, pageNum);
        // get current page of items
        this.jobsList = this.tempJobsList.slice(this.activePager.startIndex, this.activePager.endIndex + 1);
    }

    showSubJobsfunc(jobId) {

        for (let job of this.jobsList) {
            if (job.id == jobId) {
                if (job.showSubJobs) {
                    job.showSubJobs = false;
                }
                else {
                    job.showSubJobs = true;
                }
            }
            else {
                job.showSubJobs = false;
            }
        }



    }
    refreshPagination() {
        this.paginationLength = this.displayLimit;
        this.setActivePage(1, this.paginationLength);
    }

    deploy(jobId: any) {
        console.log(" inside deploy");
        this.depStatus[jobId] = "STARTED";
        this.dataIngestionService.deploy(jobId, this.userId).subscribe((Response: any) => {
            console.log(" before json");
            this.jobstatus = Response.json();
            if (this.jobstatus == 1 || this.jobstatus == 2 || this.jobstatus == 3) {
                this.fetchJobsList();
                this.depStatus = [];
            }
        });

    }

    execute(jobId: any) {
        var executeStatus;
        console.log(" inside execute");
        this.exStatus[jobId] = "STARTED";
        console.log("extatus before:", this.exStatus);
        this.dataIngestionService.execute(jobId, this.userId).subscribe((Response: any) => {
            executeStatus = Response._body;
            // if (executeStatus == "SUCCEEDED" || executeStatus == "FAILED" || executeStatus == "KILLED") {
            //     console.log("extatus after:", this.exStatus);
            //     this.fetchJobsList();
            //     this.exStatus = [];
            // }
            if (executeStatus !== null) {
                this.fetchJobsList();
                this.exStatus = [];
            }
        });

    }

    searchJobs() {
        this.jobsList = this.filterPipe.transform(this.tempJobsList, this.search);
        // this.tempJobsList = this.jobsList;
        // this.setActivePage(1, this.displayLimit);
    }

    sortJobs(colName: string) {

        this.sortDirection = !this.sortDirection;
        let direction = this.sortDirection ? 1 : -1;
        this.jobsList = this.orderByPipe.transform(this.jobsList, { property: colName, direction: direction });
        // this.tempJobsList = this.jobsList;
        // this.setActivePage(1, this.displayLimit);
    }

    initStatusInfoMover(e: any) {
        let cellIndex = $(e.target).parent()[0].cellIndex;
        if (cellIndex > 4 && cellIndex < 8) {
            let tdPos = $(e.target).parent().position();
            let iconLeft = $(e.target).parent()[0].children[0].offsetLeft;
            let iconTop = $(e.target).parent()[0].children[0].offsetTop + 110;
            $(".status-info-wrapper").css("left", tdPos.left + iconLeft);
            $(".status-info-wrapper").css("top", tdPos.top + iconTop);
            $(".status-info-wrapper").slideDown(400);
        }
    }

    initStatusInfoMout() {
        $(".status-info-wrapper").slideUp(0);
    }

    dismissModal() {
        $("#createjobs").modal("hide");
        setTimeout(() => {
            $("#rdms-dbconnection").modal("show");
        }, 600);
        this.dbSchemas = [];
        this.connectAndResetForm.reset();
        this.initConnectForm();
    }

    openFileModal(workflowTypeParam) {

        $("#createjobs").modal("hide");
        $("#table-area").hide();
        setTimeout(() => {

            $("#fileModal").modal("show");
            console.log("resetting upload");
            this.csvColumns = [];
            console.log("this is inside file modal", this.csvColumns)
            this.csvName = "Choose file to upload";
            this.workflowType = workflowTypeParam;
            console.log("WorkflowType --> " + this.workflowType);
            $("#input-file").val(null);
            $(".file-popup .file-info .file-name").text(this.csvName).addClass("uploaded").siblings(".close").hide();
            $("#submit-csv").attr('disabled', true);
            this.csvComments = '';
        }, 600);
        $("#action-result").hide();

    }

    initConnectForm() {
        this.connectAndResetForm = new FormGroup({
            dbPort: new FormControl("1433", Validators.required),
            dbName: new FormControl("DimeDemoDB", Validators.required),
            dbUrl: new FormControl("jdbc:sqlserver://172.25.104.8\\\\\\\\SQLEXPRESS", Validators.required),
            dbUser: new FormControl("tegtest1", Validators.required),
            dbPassword: new FormControl("tcs@12345", Validators.required),
            driverClass: new FormControl("com.microsoft.sqlserver.jdbc.SQLServerDriver", Validators.required),
            dbSchemas: new FormControl("", Validators.required)
        });
        this.resetConnectForm = false;
        this.connectSuccess = false;
        this.connectError = false;
    }

    submitConnectForm(formValue: any) {
        // console.log("schemae form value",this.connectAndResetForm.controls['dbSchemas'].value);
        // formValue['dbSchemas']=this.connectAndResetForm.controls['dbSchemas'].value;
        // $(".select2-selection__choice").each(function() {
        //     console.log($(this).attr("title"));
        //     this.selectedSchemas.push($(this).attr("title"))
        // });
        var arr = [];
        $("#dbSchemas option:selected").each(function () {
            console.log("value3", $(this).val());
            console.log("value4", $(this).text());
            arr.push($(this).text());
        })
        console.log("contorls", this.connectAndResetForm);
        Object.keys(this.connectAndResetForm.controls).forEach(field => {
            const control = this.connectAndResetForm.get(field);
            control.markAsTouched({ onlySelf: true });
        });
        formValue["dbSchemas"] = arr.join();
        if(arr.length!=0){
        this.connectAndResetForm.controls["dbSchemas"].setValue(arr.join());
        this.connectAndResetForm.controls["dbSchemas"].setErrors(null);
        }
        console.log('form value: ', formValue);

        if (this.connectAndResetForm.valid) {
            this.showHorizontalLoader = true;
            this.connectFormValue = formValue;
            this.dataIngestionService.fetchTablesList(formValue).subscribe((response: any) => {
                this.showHorizontalLoader = false;
                let responseJson = response.json();
                console.log("submitConnectForm(): ", responseJson);
                if (responseJson.result == "OK") {
                    this.tablesList = responseJson.records;
                    console.log("tablelist: ", this.tablesList);
                    this.tablesList.forEach(function (obj) {
                        obj.allCloumnsChecked = false;
                    }
                    )
                    console.log("after new field: ", this.tablesList);
                    this.tempTablesList = JSON.parse(JSON.stringify(this.tablesList));
                    console.log("temp table list: ", this.tempTablesList);
                    this.connectSuccess = true;
                    this.connectError = false;
                    $("#rdms-dbconnection .ButtonRow button").attr("disabled", "disabled");
                    setTimeout(() => {
                        $("#rdms-dbconnection").modal("hide");
                        $("#rdms-dbconnection .ButtonRow button").removeAttr("disabled");
                        this.initConnectForm();
                        setTimeout(() => {
                            $("#openRDBMSPopup").modal("show");
                            $("#openRDBMSPopup").find("#action-result").hide();
                        }, 600);
                    }, 2000);
                }
                else {
                    this.connectSuccess = false;
                    this.connectError = true;
                    setTimeout(() => {
                        this.connectError = false;
                        // $("#rdms-dbconnection").modal("hide");
                        // this.initConnectForm();
                    }, 2000);
                }
            }, (err: any) => {
                this.showHorizontalLoader = false;
            });

        }
    }

    searchTables() {
        this.tablesList = this.filterPipe.Tabletransform(this.tempTablesList, this.searchTable);
    }

    fetchColumns(table: any, e: any) {
        console.log("Table: ", table);
        if ($(e.target).parents(".panel-heading").hasClass("maximize")) {
            $(e.target).parents(".panel-default").removeClass("maximize");
            $(e.target).parents(".panel-heading").removeClass("maximize").find(".icon").removeClass("minimize").addClass("maximize");
        }
        else {
            $(e.target).parents(".panel-default").siblings(".panel-default").removeClass("maximize").children(".panel-heading").removeClass("maximize").find(".icon").removeClass("minimize").addClass("maximize");
            $(e.target).parents(".panel-heading").parents(".panel-default").addClass("maximize");
            $(e.target).parents(".panel-heading").addClass("maximize").find(".icon").removeClass("maximize").addClass("minimize");
        }
        this.fetchColumnsList(table);
    }

    fetchColumnsList(table: any) {
        let idx = this.tablesList.indexOf(table);
        console.log("index found: ", idx);
        console.log("table.columnsFetched: ", table.columnsFetched);
        if (typeof table.columnsFetched == 'undefined') {
            this.connectFormValue.tableName = table.entityName;
            this.connectFormValue.schemaName = table.schema;
            this.dataIngestionService.fetchColumnsList(this.connectFormValue).subscribe((response: any) => {
                let responseJson = response.json();
                console.log("fetchColumnsList Service response: ", responseJson);
                for (let i = 0; i < responseJson.length; i++) {
                    responseJson[i].checked = table.allCloumnsChecked;
                }
                this.tablesList[idx].columnsList = responseJson;
                this.tablesList[idx].columnsFetched = true;
                this.tempTablesList[idx].columnsList = responseJson;
                this.tempTablesList[idx].columnsFetched = true;
            });

        }

        console.log("table with checked column list: ", this.tablesList[idx]);
    }

    searchColumns(table: any) {
        let idx = this.tablesList.indexOf(table);
        let tidx = -1;
        for (let i = 0; i < this.tempTablesList.length; i++) {
            if (table.entityName == this.tempTablesList[i].entityName) {
                tidx = i;
                break;
            }
        }
        let tempColumnsList = this.tempTablesList[tidx].columnsList;
        this.tablesList[idx].columnsList = this.filterPipe.Tabletransform(tempColumnsList, this.searchColumn);
    }

    checkAllColumns(table: any, e: any) {
        console.log(table);
        console.log(e);
        let idx = this.tablesList.indexOf(table);
        // console.log("e.target.checked: ", e.target.checked);
        table.allCloumnsChecked = e;
        this.tablesList[idx].allCloumnsChecked = e;
        this.tablesList[idx].columnsList.forEach(function (obj) {
            obj.checked = e;
        }
        )
        console.log("check status: ", table);
    }

    checkColumns(table: any, column: any, e: any) {
        console.log(e);
        let idx = this.tablesList.indexOf(table);
        let columnsList = this.tablesList[idx].columnsList;
        let cidx = columnsList.indexOf(column);
        this.tablesList[idx].columnsList[cidx].checked = e;
        if (e == false) {
            this.tablesList[idx].allCloumnsChecked = false;
        }
        console.log(table);
        // console.log("e.target.checked: ", e);
        // let columnsList = this.tablesList[idx].columnsList;
        // let cidx = columnsList.indexOf(column);
        // columnsList[cidx].checked = e.target.checked;
        // this.tablesList[idx].columnsList[cidx].checked = e.target.checked;

    }

    initCreateJobsForm() {
        $(".panel-default").on("hide.bs.collapse", function (e: any) {
            $(e.target).siblings(".panel-heading").removeClass("maximize").find("span.icon").removeClass("minimize").addClass("maximize");
        });
        $(".panel-default").on("show.bs.collapse", function (e: any) {
            $(e.target).siblings(".panel-heading").addClass("maximize").find("span.icon").removeClass("maximize").addClass("minimize");
        });
    }

    checkVal() {
        this.showMultitable = true;

        this.columnSelected = false;
        this.isDestTableNameAbsent = false;
        this.tablesSelected = [];


        console.log("checkVal");

        let tbllist = JSON.stringify(this.tablesList);
        console.log(" tables list " + tbllist);
        for (let obj of this.tablesList) {

            if (obj.allCloumnsChecked == true) {
                this.tablesSelected.push(obj.entityName);
                this.columnSelected = true;

            }
            else if (obj.columnsList) {
                console.log("obj.entityname" + obj.entityName);
                for (var i = 0; i < obj.columnsList.length; i++) {
                    console.log("obj.columnsList[i].checked" + obj.columnsList[i].checked);
                    if (obj.columnsList[i].checked == true) {
                        this.tablesSelected.push(obj.entityName);
                        this.columnSelected = true;

                    }
                }
            }
        }

        if (this.tablesSelected.length > 0) {
            for (let eachTblSelected of this.tablesSelected) {
                let destTableName  = (<HTMLInputElement>document.getElementById("dest_" + eachTblSelected)).value;
                // let destTableName  = $("#dest_" + eachTblSelected).val();
                console.log("destTableName " + destTableName + " for  " + eachTblSelected);
                if (destTableName == "" || destTableName == null) {
                    this.isDestTableNameAbsent = true;
                    console.log("no dest name");
                }
            }
        }
        console.log("tables selected" + this.tablesSelected);
        console.log("this.columnSElected " + this.columnSelected + " and this.isDestTableNameAbsent " + this.isDestTableNameAbsent);


        if ((this.columnSelected == true) && (this.isDestTableNameAbsent == false)) {
            if (this.tablesSelected.length > 1) {
                this.showMultitable = false;
            }
            if (this.showMultitable) {
                this.createJob();
            }

        }


        else if ((this.columnSelected == false) && (this.isDestTableNameAbsent == true)) {
            console.log("here");
            $("#action-result .action-icon").addClass("failure");
            $("#action-result .action-text").find("span").text("Please select atleast one table");
            $("#openRDBMSPopup").find("#action-result").show().delay(2000).fadeOut();

        }
        else if (this.columnSelected == false) {
            $("#action-result .action-icon").addClass("failure");
            $("#action-result .action-text").find("span").text("Please select atleast one table");
            $("#openRDBMSPopup").find("#action-result").show().show().delay(2000).fadeOut();
            console.log("here1");

        }
        else if (this.isDestTableNameAbsent == true) {
            console.log("here2");
            $("#action-result .action-icon").addClass("failure");
            $("#action-result .action-text").find("span").text("Destination Table Name is mandatory.");
            $("#openRDBMSPopup").find("#action-result").show().delay(2000).fadeOut();
        }
    }

    getMultiTableValue(multitableValue) {
        this.multitableValue = multitableValue;
        this.showMultitable = true;
        this.createJob();
    }

    closeRDBMSPopup() {

        $("#submit-ingestion").attr('disabled', false);
        this.showMultitable = true;
        this.columnSelected = false;
        this.columnNotSelectedMesg = false;
        this.isDestTableNameAbsent = false;
        this.destTblNotMentionedMesg = false;
        this.comments = '';
        this.connectAndResetForm.reset();
    }

    fetchSchemas() {
        this.dbSchemas = [];
        console.log("inside fetch schema");
        console.log("dbname status", this.connectAndResetForm.controls.dbName.status);
        var ctrl = this.connectAndResetForm.controls;
        if (ctrl.dbName.valid && ctrl.dbPassword.valid && ctrl.dbPort.valid && ctrl.dbUrl.valid && ctrl.dbUser.valid && ctrl.driverClass.valid) {
            console.log("db name is correct");
            console.log("form value", this.connectAndResetForm.value);
            this.dataIngestionService.fetchSchemaList(this.connectAndResetForm.value).subscribe((response: any) => {
                this.dbSchemas = JSON.parse(response._body);
                console.log("response of schemas", response);
            })
        }
    }
    createJob() {
        //this block of code is used only when redirected from ipc ingestion
        let description = null;
        this.route.queryParams
            .subscribe(params => {
                description = params['description'];
                console.log("query params" + params.description); // {order: "popular"}
                console.log("query params" + description); // popular

            });

        let that = this;
        var createTableJson: any = {};
        this.tablesList.forEach(function (obj) {
            if (obj.columnsFetched == true) {
                var destTableName;
                for (var i = 0; i < obj.columnsList.length; i++) {
                    if (obj.columnsList[i].checked == true) {
                        console.log(obj.entityName);
                        console.log(obj.columnsList[i]);
                        destTableName = (<HTMLInputElement>document.getElementById("dest_" + obj.entityName)).value;
                        // destTableName = $("#dest_" + obj.entityName).val();
                        console.log("dest_table_name: ", destTableName);
                        createTableJson["destTableName_" + obj.schema + "@" + obj.entityName] = destTableName;
                        createTableJson["srcTableName_" + obj.schema + "@" + obj.entityName] = obj.entityName;
                        createTableJson["srcColumnDType_" + obj.schema + "@" + obj.entityName + "." + obj.columnsList[i].entityName] = obj.columnsList[i].dtype;
                        createTableJson["srcColumnName_" + obj.schema + "@" + obj.entityName + "." + obj.columnsList[i].entityName] = obj.columnsList[i].entityName;
                        createTableJson["srcColumnIndex_" + obj.schema + "@" + obj.entityName + "." + obj.columnsList[i].entityName] = obj.columnsList[i].columnId;
                        createTableJson["primaryKeyColumn_" + obj.schema + "@" + obj.entityName] = obj.primaryKeyColumn;
                        createTableJson["schema_" + obj.schema + "@" + obj.entityName] = obj.schema;


                    }
                }
            }
        });
        console.log("table list ", createTableJson);
        console.log("connection value: ", this.connectAndResetForm.value);
        createTableJson["isMultiTable"] = that.multitableValue;
        createTableJson.dbUser = this.connectFormValue.dbUser;
        createTableJson.driverClass = this.connectFormValue.driverClass;
        createTableJson.dbUrl = this.connectFormValue.dbUrl;
        createTableJson.dbPassword = this.connectFormValue.dbPassword;
        createTableJson.dbName = this.connectFormValue.dbName;
        createTableJson.dbPort = this.connectFormValue.dbPort;
        // createTableJson.dbSchemas = this.connectFormValue.dbSchemas;
        createTableJson.tbComments = this.comments;
        createTableJson.uid = this.userId;
        createTableJson.description = description;

        console.log(createTableJson);
        let checkjson = JSON.stringify(createTableJson);
        this.dataIngestionService.createJob(createTableJson).subscribe((response: any) => {
            console.log(response._body);
            $("#openRDBMSPopup").find("#action-result").show();
            $("#action-result .action-icon").removeClass("failure").addClass("success");
            $("#action-result .action-text").find("span").text("Job Created Successfully");
            setTimeout(function () {
                $('#openRDBMSPopup').modal('toggle')
            }, 2000);
            this.jobsList = null;
            this.tempJobsList = null;
            this.fetchJobsList();
            if (description == "ipc") {
                this.commonServices.triggerIceValidations.next(true);
            }
        });
    }

    passJobId(jobId: number, jobName: string, jobComments: string) {
        this.jobId = jobId;
        this.destTblName = jobName;
        if (jobComments == 'LargeFilesIngestion') {
            this.rerunForLargeFile(jobId, jobComments);
        }
        else {
            $("#selectLoad").modal("show");
        }
    }

    incrementalLoads() {
        console.log("incre selected");
        this.radioSelected = "IncrementalLoad";
        this.dataIngestionService.getColumns(this.jobId, this.userId).subscribe((Response: any) => {
            console.log(Response);
            this.columnsList = Response.json();
            console.log("columnsList: ", this.columnsList);
            if (this.columnsList != null) {
                this.display = true;
            }
        });
    }

    truncateLoad() {
        this.columnSelErr = false;
        this.radioSelected = "TruncateAndLoad";

        console.log("truncate selected");
        this.display = false;
        this.columnName = undefined;
        this.colDataType = undefined;

    }


    passSelColumn(columnName, colDataType) {
        this.columnSelErr = false;
        this.columnName = columnName;
        this.colDataType = colDataType;
        console.log("inside passSelColumn" + columnName + "  " + colDataType);
        console.log("inside pass colun values");
    }

    closereRunpopUp() {
        console.log("inside closereRunpopUp");
        this.radioSelected = "TruncateAndLoad";
        this.display = false;

        $('#selectLoad').modal('hide');
        $("#rerun-submit").attr('disabled', false);
        $('#selectLoad .ok-btn').hide();
        $("#selectLoad .rerunSuccessInfo").attr('hidden', 'hidden');


    }
    submitLoadType() {
        if (this.radioSelected == "TruncateAndLoad") {

            let body = {
                "jobId": this.jobId, "loadType": "TruncateAndLoad",
                "destTableJob": this.destTblName
            };
            console.log(body);
            this.dataIngestionService.postreRun(body).subscribe((Response: any) => {
                this.rerunStatus = Response;
                console.log("rerunStatus: ", this.rerunStatus);

                if (this.rerunStatus._body == "SUCCEEDED") {
                    console.log("succeded");
                    this.rerunResponse = "Successfully changed the workflow";
                    $("#selectLoad .rerunSuccessInfo").removeAttr("hidden");
                    $("#selectLoad .rerunSuccessInfo .FailureImg").removeClass("FailureImg").addClass("SuccessImg");

                    $("#selectLoad .ok-btn").show();
                    $(this).hide();
                }
                else if (this.rerunStatus._body == "FAILED") {
                    this.rerunResponse = "Failed to change the workflow";
                    $("#selectLoad .rerunSuccessInfo .SuccessImg").removeClass("SuccessImg").addClass("FailureImg");
                    $("#selectLoad .rerunSuccessInfo").removeAttr("hidden");
                    $("#selectLoad .ok-btn").show();

                    $(this).hide();

                }
            }
            );
        }
        else if (this.radioSelected == "IncrementalLoad") {

            if (this.columnName !== undefined && this.colDataType !== undefined) {
                let body = {
                    "jobId": this.jobId, "loadType": "IncrementalLoad",
                    "destTableJob": this.destTblName, "selectedColumn": this.columnName, "selectedDatatype": this.colDataType
                };
                console.log(body);
                this.dataIngestionService.postreRun(body).subscribe((Response: any) => {
                    this.rerunStatus = Response;
                    console.log("rerunStatus: ", this.rerunStatus);
                    this.columnName = undefined;
                    this.colDataType = undefined;
                    if (this.rerunStatus._body == "SUCCEEDED") {

                        this.rerunResponse = "Successfully changed the workflow";
                        $("#selectLoad .rerunSuccessInfo").removeAttr("hidden");
                        $("#selectLoad .ok-btn").show();
                        $(this).hide();
                    }
                    else if (this.rerunStatus._body == "FAILED") {
                        this.rerunResponse = "Failed to change the workflow";
                        $("#selectLoad .rerunSuccessInfo").removeAttr("hidden");
                        $("#selectLoad .ok-btn").show();

                        $(this).hide();
                    }
                });
            }
            else {
                this.columnSelErr = true;
            }
        }
        this.fetchJobsList();
        // this.dataIngestionService.getJobsList(this.userId).subscribe((Response: any) => {
        //     this.jobsList = Response.json();
        //     this.jobCount = this.jobsList.length;
        //     console.log("JobList: ", this.jobsList);
        //     this.tempJobsList = this.jobsList;
        // });

        // $("#rerun-submit").attr('disabled', 'disabled');
        // setTimeout(() => {
        //     $("#selectLoad").modal("hide");
        //     $("#rerun-submit").attr('disabled', false);
        //     $("#selectLoad .rerunSuccessInfo").attr('hidden', 'hidden');
        // }, );

    }

    hideSucess() {

        this.radioSelected = "TruncateAndLoad";
        this.display = false;
        console.log("inside hidesuccess");
        $("#selectLoad .rerunSuccessInfo").attr("hidden", "hidden");
        $("#selectLoad .ok-btn").hide();
        $('#selectLoad').modal('hide');
        $("#rerun-submit").attr('disabled', false);
    }

    csvUpload(files: FileList) {
        console.log("inside CSV upload component");
        this.csvColumns = [];
        this.fileToUpload = files.item(0);
        this.csvName = files.item(0).name;

        console.log("file name: ", this.csvName);
        $(".file-popup .file-info .file-name").text(this.csvName).addClass("uploaded").siblings(".close").show();
        this.dataIngestionService.uploadCSV(this.fileToUpload).subscribe((Response: any) => {
            var res = JSON.parse(Response._body);
            if (res == "Table name already exists please change the file name to insert") {
                $("#action-result .action-icon").removeClass("failure").addClass("failure");
                $("#action-result .action-text").find("span").text("Table name already exists !!");
                $("#action-result").show().delay(3000).fadeOut(300);
                $("#submit-csv").attr('disabled', true);
                console.log("Table name already exists");
            }
            else {
                $('#table-area').show();
                this.csvColumns = res;
                console.log(this.csvColumns);
                $("#submit-csv").attr('disabled', false);
            }
        }, error => {
            console.log(error);
        });
        $("#input-file").val(null);
    }

    resetCSVUpload() {
        console.log("resetting upload");
        this.csvColumns = [];
        this.csvName = "Choose file to upload";
        $("#input-file").val(null);
        $(".file-popup .file-info .file-name").text(this.csvName).addClass("uploaded").siblings(".close").hide();
        $("#submit-csv").attr('disabled', true);
        $("#table-area").hide();
        this.csvComments = '';
    }

    displayDateField(value: string, column: string) {
        $("#data-type-" + column).css('display', 'none');
        console.log("selected value", value);
        console.log(typeof (value));
        console.log("column name", column);
        if (value == "DATE") {
            console.log("changing css");
            $("#data-type-" + column).css('display', 'block');
        }
    }

    submitCSV() {
        //this block of code is used only when redirected from ipc ingestion
        let description = null;
        this.route.queryParams
            .subscribe(params => {
                description = params['description'];
                console.log("query params" + params.description); // {order: "popular"}
                console.log("query params" + description); // popular

            });

        $("#submit-csv").attr('disabled', true);
        var csvJSON = [];
        $("#csvTable tr:gt(0)").each(function () {
            var this_row = $(this);
            var obj = {};
            var data1 = this_row.find('td:eq(0)');//td:eq(0) means first td of this row
            obj["columnName"] = data1.text();
            console.log(obj);
            var data2 = this_row.find('td:eq(1)').find('select').val();
            obj["dataType"] = data2;
            if (data2 == "DATE") {
                obj["formate"] = this_row.find('td:eq(2)').find('select').val();
            }
            console.log("obj data", obj);
            console.log("obj type", typeof (obj));
            console.log("obj type", typeof (this.csvJSON));
            csvJSON.push(obj);
        });
        console.log(csvJSON);
        var csv = JSON.stringify(csvJSON);
        console.log("WorkflowType in SubmitCSV --> " + this.workflowType);
        this.dataIngestionService.createCSVJob(this.fileToUpload, csv, this.userId, this.csvComments, description, this.workflowType).subscribe((Response: any) => {
            console.log(Response);
            $("#submit-csv").attr('disabled', false);
            $("#action-result .action-icon").removeClass("failure").addClass("success");
            $("#action-result").show().delay(3000).fadeOut(300);
            $("#action-result .action-text").find("span").text("Job Created Successfully");
            this.fetchJobsList();
            this.resetCSVUpload();
            if (description == "ipc") {
                this.commonServices.triggerIceValidations.next(true);
            }
        }, error => {
            console.log(error);
        });
    }

    getLineage(treeData) {
        let that = this;
        console.log("inside get lineage");
        var margin = { top: 20, right: 10, bottom: 20, left: 0 },
            width = 800 - margin.right - margin.left,
            height = 350 - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.y, d.x]; });

        var zoom = d3.behavior.zoom().scaleExtent([0.5, 4]).on("zoom", zoomed);
        //console.log("#"+divGraphName);
        //$("#lineage-diagram").empty();
        var svg = d3.select("#lineage-diagram").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .call(zoom)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .append("g");
        console.log("svg" + svg);
        console.log("treeData" + treeData);
        root = treeData;
        root.x0 = height / 2;
        root.y0 = 0;

        update(root);

        function resetZoom() {
            let scale = 1.0;
            svg.attr("transform", "translate(0,0) scale(1,1)");
            zoom.scale(scale).translate([0, 0]);
        }

        function interpolateZoom(translate, scale) {
            var self = this;
            return d3.transition().duration(350).tween("zoom", function () {
                var iTranslate = d3.interpolate(zoom.translate(), translate),
                    iScale = d3.interpolate(zoom.scale(), scale);
                return function (t) {
                    zoom
                        .scale(iScale(t))
                        .translate(iTranslate(t));
                    zoomed();
                };
            });
        }

        function zoomIn() {
            var clicked = d3.event.target,
                direction = 1,
                factor = 0.2,
                target_zoom = 1,
                center = [width / 2, height / 2],
                extent = zoom.scaleExtent(),
                translate = zoom.translate(),
                translate0 = [],
                l = [],
                view = { x: translate[0], y: translate[1], k: zoom.scale() };

            d3.event.preventDefault();
            direction = (this.id === 'zoom-in') ? 1 : -1;
            target_zoom = zoom.scale() * (1 + factor * direction);

            if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

            translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
            view.k = target_zoom;
            l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

            view.x += center[0] - l[0];
            view.y += center[1] - l[1];

            interpolateZoom([view.x, view.y], view.k);
        }
        d3.selectAll('span.zoom-btn').on('click', zoomIn);
        d3.selectAll('span.recenter').on('click', resetZoom);
        d3.selectAll('select[name=node-type]').on('change', highlightNode);

        function zoomed() {
            svg.attr("transform",
                "translate(" + zoom.translate() + ")" +
                "scale(" + zoom.scale() + ")"
            );
        }

        function update(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root),
                links = tree.links(nodes);

            _.each(nodes, function (o: any, i) {
                var itemsOfTheSameDepth = _.where(nodes, { depth: o.depth });
                var indexOfCurrent = _.indexOf(itemsOfTheSameDepth, o);
                var interval = height / itemsOfTheSameDepth.length;
                nodes[i].x = interval / 2 + (interval * indexOfCurrent);
            });


            _.each(links, function (o: any, i) {
                links[i].target = _.find(nodes, { id: o.target.id });
            });

            // Normalize for fixed-depth.
            nodes.forEach(function (d) { d.y = d.depth * 250; });

            //Remove the hidden nodes
            svg.selectAll("g.hidden").remove();

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function (d) { return d.id || (d.id = ++i); })

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", function (d) {
                    console.log("Node class check : ", d.id);
                    return d.id === "root-node" ? "node hidden" : "node";
                })
                .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });


            // nodeEnter.append("rect")
            //  .attr("x", "-70")
            //  .attr("y", "24")
            //  .attr("width", "150px")
            //  .attr("height", "25px")
            //  .attr("fill", function(d) { return d.bgColor; })
            //  .style("stroke", function(d) { return d.borderColor; });

            nodeEnter.append("rect")
                .attr("x", "15")
                .attr("y", "-10")
                .attr("width", "150px")
                .attr("height", "20px")
                .attr("fill", function (d) { return d.bgColor; })
                .style("stroke", function (d) { return d.borderColor; });



            nodeEnter.append("circle")
                .attr("r", 1e-6).on("click", click);

            // nodeEnter.append("image")
            //  .attr("xlink:href", function (d) { return "../../assets/images/" + d.icon; })
            //  .attr("x", "-17px")
            //  .attr("y", "-14px")
            //  .attr("width", "27px")
            //  .attr("height", "27px")
            //  .on("click", click);



            nodeEnter.append('text')
                .attr("x", "0")
                .attr("y", "4")

                .attr("class", "circle-text")
                .text(function (d) { return d.type; })
                .attr("text-anchor", "middle");


            nodeEnter.append("text")
                .attr("x", "30")
                .attr("dy", "0.3em")
                .attr("class", "rect-text")
                .attr("text-anchor", "start")
                .text(function (d) {
                    if (d.name.length > 23) {
                        return d.name.substr(0, 22) + "...";
                    }
                    return d.name;
                })

                /*.on("click", function (d) {
                    console.log("Table Name: ", d);
    	
                })*/
                .append("title").text(function (d) {
                    if (d.name.length > 23) {
                        return d.name;
                    }
                })




            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("g.node")
                .style("fill-opacity", function (d) {
                    let val = $("select[name=node-type]").val();
                    let fillOpacity = 1.0;
                    if (val != "") {
                        if (d.type == val) {
                            fillOpacity = 1.0;
                        }
                        else {
                            fillOpacity = 0.2;
                        }
                    }
                    return fillOpacity;
                });

            nodeUpdate.select("circle")
                .attr("r", 20)
                .style("fill", function (d) {
                    return d.borderColor;
                })
                .style("fill-opacity", function (d) {
                    let val = $("select[name=node-type]").val();
                    console.log("Select value: ", val);
                    let fillOpacity = 1.0;
                    if (val != "") {
                        if (d.type == val) {
                            fillOpacity = 1.0;
                        }
                        else {
                            fillOpacity = 0.2;
                        }
                    }
                    return fillOpacity;
                });



            nodeUpdate.select("text.circle-text")
                .style("fill-opacity", function (d) {
                    let val = $("select[name=node-type]").val();
                    let fillOpacity = 1.0;
                    if (val != "") {
                        if (d.type == val) {
                            fillOpacity = 1.0;
                        }
                        else {
                            fillOpacity = 0.2;
                        }
                    }
                    return fillOpacity;
                });

            nodeUpdate.select("text.rect-text")
                .style("fill-opacity", function (d) {
                    let val = $("select[name=node-type]").val();
                    let fillOpacity = 1.0;
                    if (val != "") {
                        if (d.type == val) {
                            fillOpacity = 1.0;
                        }
                        else {
                            fillOpacity = 0.2;
                        }
                    }
                    return fillOpacity;
                });

            nodeUpdate.select("rect")
                .style("fill-opacity", function (d) {
                    let val = $("select[name=node-type]").val();
                    let fillOpacity = 1.0;
                    if (val != "") {
                        if (d.type == val) {
                            fillOpacity = 1.0;
                        }
                        else {
                            fillOpacity = 0.2;
                        }
                    }
                    return fillOpacity;
                });


            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            //Remove the hidden links	
            svg.selectAll("path.hidden").remove();

            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links);

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", function (d) {
                    return (d.source.id === "root-node" || d.target.id === "root-node") ? "link link-to-hide" : "link";
                })
                .attr("d", function (d) {
                    var o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });

                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }

        function highlightNode() {
            let val = $(this).val();
            update(root);
        }
    }
    openTimeSeriesModal() {

        $("#createjobs").modal("hide");
        $("#timeseries-table-area").hide();
        setTimeout(() => {

            $("#timeSeriesModal").modal("show");
            console.log("resetting upload");
            this.timeseriescsvColumns = [];
            console.log("this is inside file modal", this.timeseriescsvColumns)
            this.timeseriesCSVname = "Choose file to upload";
            $("#timeseries-input-file").val(null);
            $("#timeSeriesModal.file-popup .file-info .file-name").text(this.timeseriesCSVname).addClass("uploaded").siblings(".close").hide();
            $("#timeseries-submit-csv").attr('disabled', true);
            this.timeseriesCSVComments = '';
        }, 600);
        $("#timeseries-action-result").hide();

    }
    timeseriesResetCSVUpload() {
        console.log("resetting upload");
        this.timeseriescsvColumns = [];
        this.timeseriesCSVname = "Choose file to upload";
        $("#timeseries-input-file").val(null);
        $("#timeSeriesModal.file-popup .file-info .file-name").text(this.timeseriesCSVname).addClass("uploaded").siblings(".close").hide();
        $("#timeseries-submit-csv").attr('disabled', true);
        $("#timeseries-table-area").hide();
        this.timeseriesCSVComments = '';
    }

    timeseriesCSVUpload(files: FileList) {
        console.log("inside CSV upload component");
        this.timeseriescsvColumns = [];
        this.timeseriesFileToUpload = files.item(0);
        this.timeseriesCSVname = files.item(0).name;

        console.log("file name: ", this.timeseriesCSVname);
        $(".file-popup .file-info .file-name").text(this.timeseriesCSVname).addClass("uploaded").siblings(".close").show();
        this.dataIngestionService.uploadCSV(this.timeseriesFileToUpload).subscribe((Response: any) => {
            var res = JSON.parse(Response._body);
            if (res == "Table name already exists please change the file name to insert") {
                $("#timeseries-action-result .action-icon").removeClass("failure").addClass("failure");
                $("#timeseries-action-result .action-text").find("span").text("Table name already exists !!");
                $("#timeseries-action-result").show().delay(3000).fadeOut(300);
                $("#timeseries-submit-csv").attr('disabled', true);
                console.log("Table name already exists");
            }
            else {
                $('#timeseries-table-area').show();
                this.timeseriescsvColumns = res;
                console.log(this.timeseriescsvColumns);
                $("#timeseries-submit-csv").attr('disabled', false);
            }
        }, error => {
            console.log(error);
        });
        $("#timeseries-input-file").val(null);
    }


    timeseriesDisplayDateField(value: string, column: string) {
        $("#timeseries-data-type-" + column).css('display', 'none');
        console.log("selected value", value);
        console.log(typeof (value));
        console.log("column name", column);
        if (value == "DATE") {
            console.log("changing css");
            $("#timeseries-data-type-" + column).css('display', 'block');
        }
    }


    timeseriesSubmitCSV() {

        $("#timeseries-submit-csv").attr('disabled', true);
        var csvJSON = [];
        $("#timeseries-csvTable tr:gt(0)").each(function () {
            var this_row = $(this);
            var obj = {};
            var data1 = this_row.find('td:eq(0)');//td:eq(0) means first td of this row
            obj["columnName"] = data1.text();
            console.log(obj);
            var data2 = this_row.find('td:eq(1)').find('select').val();
            obj["dataType"] = data2;
            if (data2 == "DATE") {
                obj["formate"] = this_row.find('td:eq(2)').find('select').val();
            }
            console.log("obj data", obj);
            console.log("obj type", typeof (obj));
            console.log("obj type", typeof (this.csvJSON));
            csvJSON.push(obj);
        });
        console.log(csvJSON);
        var csv = JSON.stringify(csvJSON);
        this.dataIngestionService.createCSVJob(this.timeseriesFileToUpload, csv, this.userId, this.timeseriesCSVComments, undefined, this.workflowType).subscribe((Response: any) => {
            console.log(Response);
            $("#timeseries-submit-csv").attr('disabled', false);
            $("#action-result .action-icon").removeClass("failure").addClass("success");
            $("#action-result").show().delay(3000).fadeOut(300);
            $("#action-result .action-text").find("span").text("Job Created Successfully");
            this.fetchJobsList();
            this.timeseriesResetCSVUpload();

        }, error => {
            console.log(error);
        });
    }

    rerunForLargeFile(jobId: number, jobComments: string) {
        if (jobComments = 'LargeFilesIngestion') {
            let body = {
                "jobId": jobId,
                "uid": this.userId,
                "isLargeFile": "true"
            };
            console.log(body);
            this.dataIngestionService.postreRun(body).subscribe((Response: any) => {
                this.rerunStatus = Response;
                console.log("rerunStatus: ", this.rerunStatus);

                if (this.rerunStatus._body == "SUCCEEDED") {
                    this.fetchJobsList();
                }
            });
        }
    }
}
