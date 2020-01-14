import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { TransformService } from './transform.service';
import { FilterPipe } from './filter.pipe';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { ExcelService } from '../services/excel.service';
import "../../assets/js/d3.v3.min.js";
import { PaginationService } from '../pagination.service';
import { CommonService } from '../services/common.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
// import "../../assets/js/codemirror-5.40.0/lib/codemirror.js";
// import "../../assets/js/codemirror-5.40.0/mode/sql/sql.js";
declare var $: any;
declare var d3: any;
declare var CodeMirror: any;

@Component({
    // selector: 'section-content',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './transform.component.html',
    styleUrls: ['../../assets/css/transform.css', '../../assets/js/codemirror-5.40.0/lib/codemirror.css'],
    providers: [TransformService, FilterPipe, ExcelService, PaginationService]

})
export class TransformComponent implements OnInit, AfterViewInit {
    private sample = 30;
    private zappelinConnectRadioValue;
    private zappelinExecModeValue;
    public tname;
    public tlevel = "30";
    private metadataList: Array<any>;
    private previewdataList: Array<any>;
    private metadataCount;
    private previewdataCount;
    public display: boolean = false;
    public displayPreviewData: boolean = false;
    public previewTblCol;
    public previewTblData = [];
    public tempPreviewTblData = [];
    public search;
    public displayLimit = 10;
    public codeRepoDetails;
    private folderNames = [];
    private folderName;
    private fileNames = [];
    private versions = [];
    private commitedDates = [];
    public tempFileNames = [];
    private searchFile;
    public scriptOnTblName;
    private fscript;
    private commitDate;
    private commitdate = null;
    private showUserPipeline: boolean = false;
    flowDisplayLimit = 5;
    divGraphNameList = [];
    private imageSrc;
    private imageSrc_small;
    prevColItems;

    selectedColumnName: string;
    fromDate: string;
    toDate: string;
    isToDateBeforeFrom: boolean = false;

    defaultFindAndReplaceData = {
        currentValue: '',
        replaceWith: '',
        dataSetname: '',
        errorOccured: false
    };
    findAndReplaceData = { ...this.defaultFindAndReplaceData };
    @ViewChild("findAndReplaceForm") findAndReplaceForm: NgForm;

    defaultDateFilterData = {
        dataSetname: '',
        errorOccured: false
    };
    dateFilterData = { ...this.defaultDateFilterData };
    @ViewChild("dateFilterForm") dateFilterForm: NgForm;

    defaultConcatColumnData = {
        delimiter: '',
        columnName: '',
        outputColumnName: '',
        dataSetname: '',
        errorOccured: false
    };
    concatColumnData = { ...this.defaultConcatColumnData };
    @ViewChild("concatColumnForm") concatColumnForm: NgForm;

    defaultNumberFilterData = {
        fromNumber: null,
        toNumber: null,
        dataSetname: '',
        errorOccured: false
    };
    numberFilterData = { ...this.defaultNumberFilterData };
    @ViewChild("numberFilterForm") numberFilterForm: NgForm;


    flowList: Array<any>;
    tempFlowList: Array<any>;
    private selectedFlow: Array<any> = [];
    searchFlow: any;
    searchFlowComments: any;
    searchFlowCreationDate: any;
    tempFlowList1: Array<any>;
    tempFlowList2: Array<any>;
    private userTables;
    private users = [];
    private tables = [];
    objectKeys = Object.keys;
    private activePager: any = {};
    paginationLength: number = 10;
    tempPreviewdata = [];
    public flowId: any;
    radioValue: any = "workflow";
    codeTextArea: any;
    private fileName;
    cm_opt = {
        mode: "text/x-sql",
        lineNumbers: true,
        indentWithTabs: true,
        smartIndent: true,
        readOnly: true
    };
    codeEditor: any;
    private tableName;
    private tbComments;
    showLoader: boolean = false;
    showLoaderForImage: boolean = true;

    showMetaDataLoader: boolean = false;
    showPreviewTableLoader: boolean = false;
    showFindAndReplaceLoader: boolean = false;
    showDateFilterLoader: boolean = false;
    showConcatColumnLoader: boolean = false;
    showNumberFilterLoader: boolean = false;

    userId;
    lineageGraphCount;
    setFolderName: string = 'Select Folder';
    private zappelinConnectResponse;
    private fileToAdd;
    private folderOfNewFile;
    private addFileResponse;
    private tableView_Response;
    private zappelintextArea;
    private commitResponse;
    private commitMsg;
    private flowSelected;
    private showWorkflow: boolean = true;
    private userName;
    private radioVal = "workflow";
    private pipelineUserName;
    private showUserNtSel: boolean = true;
    private submitPipeline: boolean = false;
    private tblNtSel: boolean = true;
    private submitWorkflow: boolean = false;
    //private radioNtselected: boolean = true;
    private flowNtSelected: boolean = true;
    private radioSel: boolean = false;
    private flowComments = "Workflow";
    wrangleTables: Array<any> = [];
    wranglePreview: Array<any> = [];
    wranglePreviewCols = [];
    wranglePreviewData = [];
    wrangleSelTables = {};
    private sampleJson = {};
    private relatedSrcColumns = [];
    public relatedDestColumns = []
    wrangleRequestbody = {};
    zepplinLog: String;
    // @ViewChild('f') nameInputRef: ElementRef;

    @ViewChild('f') f1: NgForm;
    @ViewChild('stagingBucketForm') stagingBucketForm: NgForm;
    @ViewChild('checkinForm') checkinForm: NgForm;
    @ViewChild('copyPipelineForm') copyPipelineForm: NgForm;
    @ViewChild('transformForm') transformForm: NgForm;
    @ViewChild('selectFolderForm') selectFolderForm: NgForm;

    data: any = [{
        eid: 'e101',
        ename: 'ravi',
        esal: 1000
    }, {
        eid: 'e102',
        ename: 'ram',
        esal: 2000
    }, {
        eid: 'e103',
        ename: 'rajesh',
        esal: 3000
    }];


    data1: any = {
        "occurance_yr_wk_yr_wk": [
            "2017-07-16 00:00:00.0",
            "2017-07-16 00:00:00.0",
            "2015-10-11 00:00:00.0",
            "2017-01-15 00:00:00.0",
            "2014-09-28 00:00:00.0",
            "2017-06-18 00:00:00.0"
        ],
        "code": [
            "CODE_1",
            "CODE_1",
            "CODE_2",
            "CODE_3"
        ]
    };
    private pipelineTable;
    decorateImg = {
        'decorateImgLink': true
    }

    constructor(private route: ActivatedRoute, private transformService: TransformService, private filterPipe: FilterPipe, private excelService: ExcelService, private paginationService: PaginationService, private commonServices: CommonService) { }

    ngOnInit() {
        this.userId = localStorage.getItem('uId');
        this.userName = localStorage.getItem('UserName');

        $("#zoom_05").elevateZoom({
            zoomType: "inner",
            cursor: "crosshair"
        });
        $("#transform").modal("show");
        $(document).click(function () {
            $(".options-dropdown.dropdown-menu").hide();
            $(".data-export-container .edit-dropdown").hide();
        });
        $("#fromDate, #toDate").datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy'
        }).on('change', (e: any) => {
            //this.onChange(e.target.value);
            //console.log("Date changed for date picker :: ", e);
            if (e.target.name === "fromDate") {
                this.fromDate = e.target.value;
            }

            if (e.target.name === "toDate") {
                this.toDate = e.target.value;
            }

            this.validateDateFilter();

        });
        $(".date-icon").click(function (e) {
            $(this).parent().find("input").datepicker("show");
            e.preventDefault();
        });
        this.commonServices.abc.subscribe((res: string) => {
            console.log("response --- " + res);
            $("#transform").modal("show");
            this.showUserPipeline = false;
            this.showWorkflow = true;
            //this.radioVal = null;

        })
        // $("#transform").modal("show");
        this.fetchFlowList();
        this.fetchUserTablesForLineage();
        this.folderStructure();

        this.codeTextArea = document.getElementById("codeArea1");
        this.codeEditor = CodeMirror.fromTextArea(this.codeTextArea, this.cm_opt);

        //	console.log("CodeTextArea: ", this.codeTextArea);

        this.route.queryParams
            .subscribe(params => {
                let specFlowId = params['flowId'];
                //	console.log("query params" + params.flowId); // {order: "popular"}
                //	console.log("query params" + specFlowId); // popular
                this.fetchLineageDiagram("flowId", specFlowId);


            });
    }
    ngAfterViewInit() {

    }

    openWranglingDropdown(e: any, columnName: string) {
        let tdPos = $(e.target)[0].getBoundingClientRect();
        this.selectedColumnName = columnName;
        setTimeout(() => {
            $(".data-export-container .options-dropdown").css("left", tdPos.left);
            $(".data-export-container .options-dropdown").css("top", tdPos.top + 12);
            $(".data-export-container .options-dropdown").show();
        }, 0);
    }

    openFindReplaceMenu() {
        $(".data-export-container .find-data-wrapper").addClass("edit").find(".action-wrapper.find-replace-wrapper").removeClass("hide").siblings(".action-wrapper").addClass("hide");
        $(".data-export-container .options-dropdown").hide();
        this.findAndReplaceData = { ...this.defaultFindAndReplaceData };
        this.findAndReplaceForm.resetForm();
    }

    closeFindReplaceMenu() {
        $(".data-export-container .find-data-wrapper").removeClass("edit").find(".action-wrapper.find-replace-wrapper").addClass("hide")
    }

    openDateFilterMenu() {
        $(".data-export-container .find-data-wrapper").addClass("edit").find(".action-wrapper.date-filter-wrapper").removeClass("hide").siblings(".action-wrapper").addClass("hide");
        $(".data-export-container .options-dropdown").hide();
        this.dateFilterData = { ...this.defaultDateFilterData };
        this.dateFilterForm.resetForm();
    }

    closeDateFilterMenu() {
        $(".data-export-container .find-data-wrapper").removeClass("edit").find(".action-wrapper.date-filter-wrapper").addClass("hide");
    }

    openConcatColumnsMenu() {
        $(".data-export-container .find-data-wrapper").addClass("edit").find(".action-wrapper.concat-columns-wrapper").removeClass("hide").siblings(".action-wrapper").addClass("hide");
        $(".data-export-container .options-dropdown").hide();
        this.concatColumnData = { ...this.defaultConcatColumnData };
        this.concatColumnForm.resetForm();
    }

    closeConcatColumnsMenu() {
        $(".data-export-container .find-data-wrapper").removeClass("edit").find(".action-wrapper.concat-columns-wrapper").addClass("hide");
    }

    openNumberFilterMenu() {
        $(".data-export-container .find-data-wrapper").addClass("edit").find(".action-wrapper.number-filter-wrapper").removeClass("hide").siblings(".action-wrapper").addClass("hide");
        $(".data-export-container .options-dropdown").hide();
        this.numberFilterData = { ...this.defaultNumberFilterData };
        this.numberFilterForm.resetForm();
    }

    closeNumberFilterMenu() {
        $(".data-export-container .find-data-wrapper").removeClass("edit").find(".action-wrapper.number-filter-wrapper").addClass("hide");
    }

    openColummnEditPopup(e: any) {
        let tdPos = $(e.target)[0].getBoundingClientRect();
        setTimeout(() => {
            $(".data-export-container .edit-dropdown").css("left", tdPos.left);
            $(".data-export-container .edit-dropdown").css("top", tdPos.top);
            $(".data-export-container .edit-dropdown").show();
        }, 0);
    }

    closeEditDropDown() {
        $(".data-export-container .edit-dropdown").hide();
    }

    stagingBucket() {
        console.log("inside stafing bucket radio valu");
        this.zappelinConnectRadioValue = $("input[name='zappelinConnectRadioValue']:checked").val();
        this.zappelinExecModeValue = $("input[name='zappelinExecModeValue']:checked").val();
        console.log("radiovALUE" + this.zappelinConnectRadioValue);
        console.log("ExecVALUE" + this.zappelinExecModeValue);

    }

    zappelinConnect() {
        $("#submit-zappelin").attr('disabled', 'disabled');
        console.log("inside zapelineconnect submit method");
        this.zappelintextArea = $.trim($("#zappleinTextarea").val());
        let editorValue = this.codeEditor.getValue();

        console.log("codeeditorValue " + editorValue + " fileName " + this.fileName + " radiov " + this.zappelinConnectRadioValue + " syncval " + this.zappelinExecModeValue + "zappelinETEXTAREA " + this.zappelintextArea + " flowid: " + this.flowId + " ");
        let body = {
            "uid": this.userId,
            "fName": this.fileName,
            "fviewChanged": "no",
            "bucketValue": this.zappelinConnectRadioValue,
            "async": this.zappelinExecModeValue,
            "tbComments": this.zappelintextArea,
            "isReload": "no",
            "textdata": editorValue,
            "selectedFlowIds": this.flowId
        }

        this.transformService.zappleinConnect(body).subscribe((Response: any) => {
            $("#runcode").modal("hide");
            $("#zepplinLog").modal("show");
            console.log("zappeline connect Response " + Response._body);

            console.log("response of zap" + Response._body);
            let res = JSON.parse(Response._body);
            if (res.statusCode == 200) {
                console.log("inside if");
                this.zappelinConnectResponse = res.statusMessage;
                this.zepplinLog = res.detailedMsg;
                console.log("short msg", res.statusMessage);
                console.log("long msg", res.detailedMsg);
                $("#zepplinLog .zappelinConnectSuccessInfo").removeAttr("hidden");

                this.fetchLineageDiagram("flowId", this.flowId);
            }
            else {
                console.log("inside else");
                this.zappelinConnectResponse = res.statusMessage;
                this.zepplinLog = res.detailedMsg;
                // $("#runcode .zappelinConnectSuccessInfo .zappelinConnectSuccessImg").removeClass("zappelinConnectSuccessImg").addClass("zappelinConnectFailureImg");
                // $("#runcode .zappelinConnectSuccessInfo").removeAttr("hidden");
                $("#zepplinLog .zappelinConnectSuccessInfo .zappelinConnectSuccessImg").removeClass("zappelinConnectSuccessImg").addClass("zappelinConnectFailureImg");
                $("#zepplinLog .zappelinConnectSuccessInfo").removeAttr("hidden");
                console.log(Response);
            }
            this.commonServices.triggerIceValidations.next(true);

        })
        //	$('#zappleinTextarea').val("");
    }
    setActivePage(page: number, pageNum) {
        this.activePager = {};
        if (page < 1 || page > this.activePager.totalPages) {
            return;
        }
        // get pager object from service
        this.activePager = this.paginationService.getPager(this.tempPreviewdata.length, page, pageNum);
        // get current page of items
        this.previewTblData = this.tempPreviewdata.slice(this.activePager.startIndex, this.activePager.endIndex + 1);
    }

    refreshPagination() {
        this.paginationLength = this.displayLimit;
        this.setActivePage(1, this.paginationLength);
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.data, 'sample');
    }
    selectedJob(tname, flowId, flowComments) {
        this.flowNtSelected = false;
        this.flowSelected = flowId;
        console.log("flowselected " + this.flowSelected);
        console.log("flowcomments: " + flowComments);
        this.tname = tname;
        console.log("inside selected Job name" + this.tname);
        this.flowId = flowId;
        // this.flowComments = flowComments.toUpperCase();
        if (flowComments == null) {
            this.flowComments = "Workflow";
        }
        else {
            this.flowComments = flowComments;
        }

    }

    fetchUserTablesForLineage() {
        this.users = [];
        let uid = this.userId;
        this.transformService.fetchUserTablesForLineage(uid).subscribe((Response: any) => {
            this.userTables = Response.json();
            let userTables1 = JSON.stringify(this.userTables);
            //	console.log("usertables" + userTables1);
            for (let userTable of this.userTables) {
                this.users.push(userTable.usrName);
                //console.log("users: " + this.users);
            }
        })
    }

    tablesOfSelUser(userName) {

        if (userName !== "null") {
            this.showUserNtSel = false;
            this.pipelineUserName = userName;
        }

        console.log("sel user" + userName);
        this.tables = [];
        for (let userTable of this.userTables) {
            if (userName == userTable.usrName) {
                if (userTable.tblslevelMap.length > 0) {
                    for (let table of userTable.tblslevelMap) {
                        this.tables.push(table.tbl);
                    }
                    console.log("tables " + this.tables);

                }
            }
        }

    }
    fetchMetadata() {
        this.showMetaDataLoader = true;
        console.log("inside fetchda");
        this.transformService.getMetadata(this.tname, this.tlevel).subscribe((Response: any) => {
            this.showMetaDataLoader = false;
            console.log("inside getmeta ts file");

            this.metadataList = Response.json();
            console.log("metadataList");
            this.metadataCount = this.metadataList.length;

        }, (err: any) => {
            this.showMetaDataLoader = false;
        });
    }


    fetchPreviewdata() {
        this.showPreviewTableLoader = true;
        console.log("sample " + this.sample);
        console.log("tname preview" + this.tname);
        console.log("tlevel preview" + this.tlevel);
        this.transformService.getPreviewdata(this.tname, this.tlevel).subscribe((Response: any) => {
            this.showPreviewTableLoader = false;
            //console.log("inside getpreviewdata ts file");

            this.previewdataList = Response.json();
            console.log("previewdataList" + this.previewdataList);
            this.previewTblData = [];
            this.previewdataCount = this.previewdataList.length;
            if (this.previewdataCount > 0) {
                this.previewTblCol = this.previewdataList[0];
                for (var i = 1; i < this.previewdataCount; i++) {
                    this.previewTblData.push(this.previewdataList[i]);

                }
                this.tempPreviewTblData = this.previewTblData;
                this.tempPreviewdata = this.previewTblData;
                //console.log("this.previewTblData" + this.previewTblData);
                this.setActivePage(1, this.displayLimit);

            }
            this.prevColItems = this.previewdataList[0].length;
            console.log("no. of columns", this.prevColItems);
            var expTblWidth = $(".content-wrapper table.data-export-table").width();
            console.log("table width", expTblWidth);
            var maxWidth = expTblWidth / this.prevColItems;
            console.log("max width", maxWidth)
            $(".content-wrapper table.data-export-table tbody tr td div").css({ maxWidth: maxWidth + "px" });
            console.log("max width of div", $(".content-wrapper table.data-export-table tbody tr td div").css('max-width'));
        }, (err: any) => {
            this.showPreviewTableLoader = false;
        });
    }

    getImage(eachValue) {
        this.imageSrc = null;
        this.imageSrc = "http://172.25.118.30:50075/webhdfs/v1/user/root/poc/jpg/" + eachValue + "?op=OPEN&namenoderpcaddress=INHYDSPBDMN1.tcs.com:8020&offset=0";
        this.imageSrc_small = this.imageSrc;
        if ((eachValue.substr(eachValue.lastIndexOf('.') + 1)) == 'jpg') {
            if (this.imageSrc !== null) {
                this.showLoaderForImage = false;
            }
            $("#myModal").modal("show");
        }
    }

    closeMyModal() {
        $("#myModal").modal("hide");

    }
    fetchScript(switchtoPreview?: boolean) {
        console.log("switchtoPreview" + switchtoPreview);
        let body = {
            "uid": this.userId,
            "Method": "getCodeOfTable",
            "GTableName": this.tname
        };
        this.transformService.getScriptOnTblName(body).subscribe((Response: any) => {
            console.log("tableName" + this.tname);
            this.scriptOnTblName = Response.json();
            let response = JSON.stringify(this.scriptOnTblName);
            console.log("response" + response);
            console.log("response of default script " + this.scriptOnTblName);
            if ((this.scriptOnTblName.fName !== null) && (this.scriptOnTblName.fContent !== null)) {
                this.fileName = this.scriptOnTblName.fName;
                this.setFolderName = this.fileName.substring(0, this.fileName.indexOf("/"));
                console.log("folderName:::" + this.setFolderName);
                this.fscript = this.scriptOnTblName.fContent;
                console.log("this.fscript tblname" + this.fscript);
                this.codeEditor.setValue(this.fscript);
            }
            if (switchtoPreview === true) {
                console.log("enterred");
                $('.nav-tabs a[href="#dataexport"]').tab('show');
            }
            this.captureFolderName(this.setFolderName);
        })
    }

    searchFiles() {
        this.fileNames = this.filterPipe.transformFiles(this.tempFileNames, this.searchFile);
    }

    searchJobs() {
        this.previewTblData = this.filterPipe.transform(this.tempPreviewTblData, this.search);
    }


    captureFolderName(folder) {
        console.log(folder);
        this.folderName = folder;
        this.fileNames = [];
        this.tempFileNames = [];
        for (let eachJson of this.codeRepoDetails) {
            console.log(eachJson.folderName);
            if (eachJson.folderName == folder) {
                if (eachJson.fileVersionDTO.length > 0) {
                    let arrayOfFileJson = eachJson.fileVersionDTO;

                    for (let eachFileJson of arrayOfFileJson) {
                        console.log(eachFileJson.fileName);
                        this.fileNames.push(eachFileJson.fileName);
                    }
                    this.tempFileNames = this.fileNames;
                    console.log(this.fileNames);
                }
            }
        }
    }


    getVersions(fileName) {
        this.commitedDates = [];
        this.versions = [];
        console.log("inside getversions");
        console.log(fileName);
        let fName = this.folderName + "/" + fileName;
        this.fileName = fName;
        console.log("fname " + fName);
        this.transformService.getVersions(fName).subscribe((Response: any) => {
            this.versions = Response.json();
            console.log(Response);
            let strver = JSON.stringify(this.versions);
            console.log("versions: " + strver);
            if (this.versions.length > 0) {
                for (let eachJson of this.versions) {
                    this.commitedDates.push(eachJson.commitedDate);

                }
                console.log(this.commitedDates);
            }
        })

    }

    passCommitDate(commitDate) {
        console.log("before: " + this.commitdate);
        this.commitDate = commitDate;
        this.commitdate = commitDate;
        console.log("after: " + this.commitdate);
        if (this.commitdate !== null) {
            this.radioSel = true;
        }


    }
    openFileVersions() {
        this.commitdate = null;
        this.radioSel = false;
        $('#fileselection').modal('show');
    }
    closeFileVersions() {

        this.commitdate = null;
        this.radioSel = false;
        this.selectFolderForm.resetForm();

    }
    scriptOnVersionSel() {
        console.log("inside scriptOnVersionSel");
        $('#fileselection').modal('hide');
        // this.commitdate = null;
        // this.radioSel = false;

        for (let eachJson of this.versions) {
            if (this.commitDate == eachJson.commitedDate) {
                console.log("got matching commmit id");

                let body = {
                    "uid": this.userId,
                    "fName": eachJson.fileName,
                    "commitId": eachJson.commitID,
                    "Method": "getCodeOf"
                };
                this.transformService.getScriptOnVersion(body).subscribe((Response: any) => {
                    let response = Response.json();
                    console.log(response);
                    this.fscript = response.fContent;
                    console.log("this.fscript " + this.fscript);
                    this.codeEditor.setValue(this.fscript);
                    this.selectFolderForm.resetForm();

                })
            }
        }


    }
    lineageNodeType: string = "";

    //transform start
    fetchFlowList() {
        this.transformService.getFlowList(this.userId).subscribe((Response: any) => {
            console.log(Response);
            this.flowList = Response.json();
            let flow = JSON.stringify(this.flowList);
            console.log("FlowList: ", flow);
            this.tempFlowList = this.flowList;
            this.tempFlowList1 = this.flowList;
            this.tempFlowList2 = this.flowList;

        });
    }

    onSelectionChangeFlow(flow) {
        this.selectedFlow = flow;
        console.log("Selected Flow:" + flow.name);
        this.tname = flow.name;
        console.log("tname" + this.tname);
    }

    searchFlowList() {
        this.flowList = this.filterPipe.transformFlow(this.tempFlowList, this.searchFlow);
        console.log("search flow list" + this.flowList);
    }

    searchFlowComment() {
        console.log("comments " + this.searchFlowComments);
        this.flowList = this.filterPipe.filterComments(this.tempFlowList1, this.searchFlowComments);

    }

    searchFlowCreationDates() {
        this.flowList = this.filterPipe.filterDates(this.tempFlowList2, this.searchFlowCreationDate);
    }
    onSelectionChangeDisplay() {
        //for validatns
        this.submitPipeline = false;

        this.submitWorkflow = false;
        this.tblNtSel = true;
        this.showUserNtSel = true;
        this.flowNtSelected = true;
        //valdn end

        this.radioValue = $("input[name='radioValue']:checked").val();
        this.radioVal = $("input[name='radioValue']:checked").val();
        // for validations;
        if (this.radioVal == "workflow") {
            this.flowComments = "Workflow";
            this.pipelineUserName = null;
            this.pipelineTable = null;
            //this.radioNtselected = false;
            this.showUserPipeline = false;
            this.showWorkflow = true;
            this.flowSelected = null;
        }


        else if (this.radioVal == "pipeline") {
            this.flowComments = "Pipeline";
            this.flowSelected = null;
            //this.radioNtselected = false;
            this.showUserPipeline = true;
            this.showWorkflow = false;
            this.pipelineUserName = null;
            this.pipelineTable = null;
        }
        //end validations
    }

    selectedTable(table) {
        if (table !== "null") {
            this.tblNtSel = false;
            console.log("selected table" + table);
            this.tname = table;
            this.pipelineTable = table;
        }
    }

    onSelection() {
        this.codeEditor.setValue("");
        this.previewTblData = [];
        this.tempPreviewTblData = [];
        this.tempPreviewdata = [];
        this.previewTblCol = [];;
        this.metadataList = [];

        console.log("tname submit" + this.tname);
        let body = {
            "uid": this.userId,
            "Method": "getCodeOfTable",
            "GTableName": this.tname
        };
        $("#transform").modal("hide");
        this.flowSelected = null;
        this.transformService.getScriptOnTblName(body).subscribe((Response: any) => {
            console.log("inside response");
            this.scriptOnTblName = Response.json();
            console.log(this.scriptOnTblName);
            this.fscript = this.scriptOnTblName.fContent;
            this.codeEditor.setValue(this.fscript === null ? "" : this.fscript);
        })


        if (this.radioValue == "pipeline") {

            console.log("inside fetch pipeline tname" + this.tname);

            // this.transformService.fetchLineageOnTbl(1, this.tname).subscribe((Response: any) => {
            // 	console.log("fetchLineageOnTbl tname" + this.tname);
            // 	let data = Response.json();
            // 	for (let eachJson of data) {
            // 		this.getLineage(eachJson);

            // 	}
            // })
            this.fetchLineageDiagram("tblName", this.tname);

        }
        else {
            this.fetchLineageDiagram("flowId", this.flowId);
        }

        this.codeEditor.setOption("readOnly", true);
        $(".datascript-wrapper .tab-content").hide();
        $(".lineage-wrapper").css("height", 480).show();
        $(".datascript-wrapper .data-navigation .float-right.icon-wrapper span.icon-btn.minimize").removeClass("icon-btn minimize").addClass("icon-btn split-view");
    }

    folderStructure() {
        this.folderNames = [];
        this.transformService.getCodeRepoDetails().subscribe((Response: any) => {
            this.codeRepoDetails = Response.json();
            let abc1 = JSON.stringify(this.codeRepoDetails);
            //console.log("Code Repo Details" + abc1);

            for (let eachJson of this.codeRepoDetails) {
                this.folderNames.push(eachJson.folderName);
            }
            //console.log(this.folderNames);

			/* for (let i of this.folderNames) {
				console.log("folder of foldernames" + i);
			} */

        });
    }
    //transform end
    fetchLineageDiagram(type, flowIdorTblName) {
        //	console.log("inside workdlow flowid is" + flowIdorTblName);
        // this.divGraphNameList=[];
        this.showLoader = true;

        let inside1 = this;
        let data;

        if (type == 'flowId') {
            this.transformService.fetchLineage(this.userId, flowIdorTblName).subscribe((Response: any) => {
                data = Response.json();
                this.radioValue = "workflow";
                this.radioVal = "workflow";
                //console.log("data2" + JSON.stringify(data));
                $("#transform:input[value='workflow']").attr('checked', 'checked');
                $("#transform:input[value='pipeline']").attr('checked', false);

                this.getGraphWithData(data);

            },
                (error: any) => {
                    this.showLoader = false;
                });
        }
        else if (type == 'tblName') {
            this.transformService.fetchLineageOnTbl(this.userId, flowIdorTblName).subscribe((Response: any) => {
                data = Response.json();
                this.radioValue = "workflow";
                this.radioVal = "workflow";
                $("#transform:input[value='workflow']").attr('checked', 'checked');
                $("#transform:input[value='pipeline']").attr('checked', false);
                this.getGraphWithData(data);
            },
                (error: any) => {
                    this.showLoader = false;
                });
        }


    }

    getGraphWithData(data) {
        let dataWithDummynode = {
            "name": "root-node",
            "id": "root-node",
            "children": data
        };

        //console.log("data3" + JSON.stringify(dataWithDummynode))
        //console.log("data1: " + JSON.stringify(dataWithDummynode));
        // this.lineageGraphCount = dataWithDummynode.length;
        // console.log(this.lineageGraphCount);

        // for (let j = 0; j < this.lineageGraphCount; j++) {

        this.getLineage(dataWithDummynode);

        // }
    }
    // 
    copy_Pipeline() {
        console.log("inside copy_pipeline" + this.tableName + this.tbComments);
        let uid = this.userId;
        console.log("tname" + this.tname);
        this.transformService.copy_pipelineService(uid, this.tname, this.tableName, this.tbComments).subscribe((Response: any) => {
            console.log("response from copy_pipeline" + Response);
        })
    }
    getLineage(treeData) {
        let that = this;
        //console.log("inside get lineage");
        var margin = { top: 20, right: 120, bottom: 20, left: 120 },
            width = 1500 - margin.right - margin.left,
            height = 500 - margin.top - margin.bottom;

        var defaultPos = { top: 0, left: -200 };

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.y, d.x]; });

        var zoom = d3.behavior.zoom().scaleExtent([0.5, 4]).on("zoom", zoomed);
        // console.log("#lineage-diagram");
        $("#lineage-diagram").empty();
        var svg = d3.select("#lineage-diagram").append("svg").attr("class", "w-100")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .call(zoom)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .append("g")
            .attr("transform", "translate(" + defaultPos.left + "," + defaultPos.top + ")");

        zoom.scale(1.0).translate([defaultPos.left, defaultPos.top]);

        //console.log("svg" + svg);
        //console.log("treeData" + treeData);

        root = treeData;
        root.x0 = height / 2;
        root.y0 = 0;

        update(root);

        function resetZoom() {
            let scale = 1.0;
            svg.attr("transform", "translate(" + defaultPos.left + "," + defaultPos.top + ") scale(1,1)");
            zoom.scale(scale).translate([defaultPos.left, defaultPos.top]);
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
                .attr("width", "115px")
                .attr("height", "20px")
                .attr("fill", function (d) { return d.bgColor; })
                .style("stroke", function (d) { return d.borderColor; });

            nodeEnter.append("circle")
                .attr("r", 1e-6).on("click", click);

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
                    if (d.name.length > 17) {
                        return d.name.substr(0, 16) + "...";
                    }
                    return d.name;
                })
                .on("click", click1)

                .append("title").text(function (d) {
                    if (d.name.length > 17) {
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


        function click1(d) {
            console.log("Hi I am getting set");
            that.previewTblData = [];
            that.tempPreviewTblData = [];
            that.tempPreviewdata = [];
            that.previewTblCol = [];
            that.metadataList = [];
            console.log("set script");
            that.codeEditor.setValue("");
            console.log("to null");
            that.tname = d.name;
            let type = d.type;
            console.log("tablename" + this.tname);
            console.log("type" + type);
            if (type == "SQL") {
                console.log("clicked sql lineage tab");
                that.tlevel = "30";
            }
            else if (type == "File") {

                that.tlevel = "1";
            }
            else if (type == "R") {
                that.tlevel = "20";
            }
            else if (type == "PYSPARK") {
                that.tlevel = "40";
            }
            else if (type == "HIVE") {
                console.log("inside ty hive");
                that.tlevel = "60";
                console.log("tlevel " + that.tlevel);

            }
            else if (type == "HDFS") {
                that.tlevel = "3";
            }
            else if (type == "FOLDER") {
                that.tlevel = "2";
            }
            that.fetchPreviewdata();
            that.fetchScript(true);
            that.rosViewerLoader(d);
            $('.nav-tabs a[href="#dataexport"]').tab('show');
            that.removeWranglingModals();

        }

        function highlightNode() {
            let val = $(this).val();
            update(root);
        }

        that.showLoader = false;

    }

    rosViewerLoader(d)
    {
        console.log("passed parameter", d);
        if(/ros/i.test(d.name) && d.type=="FOLDER")
        {
            console.log("ros found");
            window.open('http://10.25.164.12:8080','ROSViewer','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,top=100,left=450,width=600,height=600,addressbar=no');
        }

    }


    windowButton(e: any) {
        if ($(e.target).hasClass("maximize")) {
            console.log("enterred window max");
            this.codeEditor.setOption("readOnly", false);
            $(".lineage-wrapper").hide();
            $(".datascript-wrapper .tab-content").css("height", 480).show();
            $(e.target).removeClass("maximize").addClass("split-view");
            $(e.target).siblings(".icon-btn").removeClass("maximize split-view").addClass("minimize");
            $(".data-export-container table.data-export-table, .script-container .file-info-wrapper").addClass("edit");
            $(".data-export-container .edit-btn, .script-container .edit-btn").hide();
            $(".data-export-container .export-btn, .script-container .edit-btn-wrapper, .script-container .action-wrapper, .script-container .script-head").removeClass("hide");
            var expTblWidth = $(".content-wrapper table.data-export-table").width();
            console.log("table width", expTblWidth);
            $(".content-wrapper table.data-export-table tbody tr td div").css({ maxWidth: expTblWidth / this.prevColItems + "px" });
        }
        else if ($(e.target).hasClass("minimize")) {
            this.codeEditor.setOption("readOnly", true);
            $(".datascript-wrapper .tab-content").hide();
            $(".lineage-wrapper").css("height", 480).show();
            $(e.target).removeClass("minimize").addClass("split-view");
            $(e.target).siblings(".icon-btn").removeClass("split-view").addClass("maximize");
        }
        else if ($(e.target).hasClass("split-view")) {
            this.codeEditor.setOption("readOnly", true);
            let lh = $(".lineage-wrapper").height();
            let dh = $(".datascript-wrapper .tab-content").height();
            if (lh > 290) {
                $(".lineage-wrapper").css("height", 290).show();
                $(".datascript-wrapper .tab-content").css("height", 290).show();
                $(".data-navigation .icon-btn:eq(0)").removeClass("split-view maximize").addClass("minimize");
                $(".data-navigation .icon-btn:eq(1)").removeClass("split-view minimize").addClass("maximize");
            }
            else if (dh > 290) {
                $(".lineage-wrapper").css("height", 290).show();
                $(".datascript-wrapper .tab-content").css("height", 290).show();
                $(".data-navigation .icon-btn:eq(0)").removeClass("split-view maximize").addClass("minimize");
                $(".data-navigation .icon-btn:eq(1)").removeClass("split-view minimize").addClass("maximize");
            }
            $(".data-export-container .edit-btn, .script-container .edit-btn").show();
            $(".data-export-container .export-btn, .script-container .edit-btn-wrapper, .script-container .action-wrapper, .script-container .script-head").addClass("hide");
            $(".data-export-container table.data-export-table, .script-container .file-info-wrapper").removeClass("edit");
            var expTblWidth = $(".content-wrapper table.data-export-table").width();
            console.log("table width", expTblWidth);
            $(".content-wrapper table.data-export-table tbody tr td div").css({ maxWidth: expTblWidth / this.prevColItems + "px" });
        }
    }

    openEditMode(e: any) {
        this.codeEditor.setOption("readOnly", false);

        $(".data-export-container table.data-export-table, .script-container .file-info-wrapper").addClass("edit");
        $(".lineage-wrapper").hide();
        $(".datascript-wrapper .tab-content").css("height", 480).show();
        $(".datascript-wrapper .data-navigation .icon-wrapper .icon-btn.maximize").removeClass("maximize").addClass("split-view");
        $(e.target).hide();
        $(".data-export-container .export-btn, .script-container .edit-btn-wrapper, .script-container .action-wrapper, .script-container .script-head").removeClass("hide");
    }

    addFile() {
        $("#addFile-submit").attr('disabled', 'disbaled');
        console.log(this.folderOfNewFile, this.fileToAdd);
        let body = {
            "folderName": this.folderOfNewFile,
            "newFileName": this.fileToAdd
        };
        this.transformService.addFile(body).subscribe((Response) => {

            let response = Response["_body"];
            console.log("response " + response);
            if (Response["_body"].toLowerCase().indexOf('successfull')) {
                this.addFileResponse = Response["_body"];
                $("#addFileFolderPopup .addFileSuccessInfo").removeAttr("hidden");
                this.folderStructure();

            } else {
                this.addFileResponse = Response["_body"];
                $("#addFileFolderPopup .addFileSuccessInfo .addFileSuccessImg").removeClass("addFileSuccessImg").addClass("addFileFailureImg");
                $("#addFileFolderPopup .addFileSuccessInfo").removeAttr("hidden");
                console.log(Response);
            }

        });
    }

    closeAddFile() {
        this.f1.resetForm();
        $("#addFile-submit").removeAttr('disabled');
        $("#addFileFolderPopup").modal("hide");
        $(".addFileSuccessInfo").attr('hidden', 'hidden');
        //this.fileToAdd = null;
        // this.folderOfNewFile = null;
    }

    close_ZappelinConnect() {
        // $("#runcode").modal("hide");
        // $("#runcode .zappelinConnectSuccessInfo .zappelinConnectFailureImg").removeClass("zappelinConnectFailureImg").addClass("zappelinConnectSuccessImg");
        // $(".zappelinConnectSuccessInfo").attr('hidden', 'hidden');
        $("#zepplinLog").modal("hide");
        $("#zepplinLog .zappelinConnectSuccessInfo .zappelinConnectFailureImg").removeClass("zappelinConnectFailureImg").addClass("zappelinConnectSuccessImg");
        $(".zappelinConnectSuccessInfo").attr('hidden', 'hidden');
        $("#submit-zappelin").removeAttr('disabled');
        //this.zappelinConnectRadioValue = null;
        //this.zappelintextArea = null;
        console.log("after zap close")
        this.stagingBucketForm.resetForm();
        this.zepplinLog = '';
    }
    tableView() {
        this.tableView_Response = null;
        console.log("table view flowId " + this.flowId);
        let body = {
            "uid": this.userId,
            "flowId": this.flowId,
            "isLineageTable": "True"
        };
        this.transformService.getTableView(body).subscribe((Response: any) => {
            let response = Response.json();
            // for (let eachJson of response) {
            // 	eachJson["childs"].push("Iadded");
            // }
            this.tableView_Response = response;

            let response1 = JSON.stringify(this.tableView_Response);
            console.log("added response" + response1);
        })

    }

    commitScriptChanges() {
        $("#checkin_submit").attr('disabled', 'disabled');
        let commitMsg = $.trim($("#commitMsgArea").val());
        let editorValue = this.codeEditor.getValue();
        console.log("filepath:" + this.fileName + "::content:" + editorValue + "::msg:" + commitMsg);
        let body = {
            "filePath": this.fileName,
            "content": editorValue,
            "cmtMsg": commitMsg,
            "userId": this.userId
        }
        let output;
        this.transformService.codeCheckIn(body).subscribe((Response: any) => {
            console.log((Response._body));
            output = Response._body;
            if (Response._body != null) {
                this.commitResponse = "Commited Successfully";
                $("#checkinPopup .commitSuccessInfo").removeAttr("hidden");
            }
            else {
                this.commitResponse = "Failed to commit";
                $("#checkinPopup .commitSuccessInfo .commitSuccessImg").removeClass("commitSuccessImg").addClass("commitFailureImg");
                $("#checkinPopup .commitSuccessInfo").removeAttr("hidden");
                console.log(Response);
            }

        });
    }


    closeCheckinPopup() {
        this.checkinForm.resetForm();
        $('#checkinPopup').modal('hide');
        $('#commitMsgArea').val("");
        $("#checkin_submit").removeAttr('disabled');
        $("#checkinPopup .commitSuccessInfo").attr('hidden', 'hidden');
    }

    validateFindAndReplaceData() {
        if (this.findAndReplaceData.currentValue == this.findAndReplaceData.replaceWith) {
            this.findAndReplaceForm.controls['replaceWith'].setErrors({ bothSame: true });
        }
    }

    OnFindAndReplaceSubmit() {
        console.log("OnFindAndReplaceSubmit called");
        let requestData = {
            uid: this.userId,
            level: this.tlevel,
            preValue: this.findAndReplaceData.currentValue,
            value: this.findAndReplaceData.replaceWith,
            newTableName: this.findAndReplaceData.dataSetname,
            oldTableName: this.tname,
            absColumnName: this.selectedColumnName,
            selectedFlowId: this.flowId
        };
        console.log("request data", requestData);
        this.showFindAndReplaceLoader = true;
        this.findAndReplaceData.errorOccured = false;
        this.transformService.findAndReplace(requestData).subscribe(
            () => {
                this.showFindAndReplaceLoader = false;
                this.findAndReplaceData = { ...this.defaultFindAndReplaceData };
                this.findAndReplaceForm.resetForm();
                this.closeFindReplaceMenu();
                this.onSelection();
            }, (err: any) => {
                this.showFindAndReplaceLoader = false;
                this.findAndReplaceData.errorOccured = true;
                console.error("Error occured in find and replace :: ", err);
            }
        );
    }

    isFromDateBeforeToDate(): boolean {

        if (this.fromDate != null && this.toDate != null) {
            let temp = this.fromDate.split("/");
            let fDate = new Date(parseInt(temp[2]), parseInt(temp[1]) - 1, parseInt(temp[0]));
            temp = this.toDate.split("/");
            let tDate = new Date(parseInt(temp[2]), parseInt(temp[1]) - 1, parseInt(temp[0]));
            return tDate < fDate;
        }
        return false;
    }

    validateDateFilter() {
        this.isToDateBeforeFrom = this.isFromDateBeforeToDate();
    }

    OnDateFilterSubmit() {
        let requestData = {
            uid: this.userId,
            level: this.tlevel,
            newTableName: this.dateFilterData.dataSetname,
            oldTableName: this.tname,
            fromDate: this.fromDate,
            toDate: this.toDate,
            absColumnName: this.selectedColumnName,
            selectedFlowId: this.flowId
        };
        this.showDateFilterLoader = true;
        this.dateFilterData.errorOccured = false;
        this.transformService.dateFilter(requestData).subscribe(
            () => {
                this.showDateFilterLoader = false;
                this.dateFilterData = { ...this.defaultDateFilterData };
                this.dateFilterForm.resetForm();
                this.closeDateFilterMenu();
                this.onSelection();
            }, (err: any) => {
                this.showDateFilterLoader = false;
                this.dateFilterData.errorOccured = true;
                console.error("Error occured in date filter :: ", err);
            }
        );
    }

    validateConcatColumn() {
        if (this.selectedColumnName === this.concatColumnData.outputColumnName) {
            this.concatColumnForm.form.controls['output_column'].setErrors({ bothSame: true });
        }
    }

    OnConcatColumnSubmit() {
        //console.log("OnConcatColumnSubmit called :: ", this.concatColumnData);
        let requestData = {
            uid: this.userId,
            level: this.tlevel,
            newTableName: this.concatColumnData.dataSetname,
            oldTableName: this.tname,
            column1: this.selectedColumnName,
            column2: this.concatColumnData.columnName,
            absColumnName: this.concatColumnData.outputColumnName,
            selectedFlowId: this.flowId,
            deLimiter: this.concatColumnData.delimiter
        };
        //console.log("Request Data :: ", requestData);
        this.showConcatColumnLoader = true;
        this.concatColumnData.errorOccured = false;
        this.transformService.concatColumn(requestData).subscribe(
            () => {
                this.showConcatColumnLoader = false;
                this.concatColumnData = { ...this.defaultConcatColumnData };
                this.concatColumnForm.resetForm();
                this.closeConcatColumnsMenu();
                this.onSelection();
            }, (err: any) => {
                this.showConcatColumnLoader = false;
                this.concatColumnData.errorOccured = true;
                console.error("Error occured in concat column :: ", err);
            }
        );
    }

    validateNumberFilter() {
        if (this.numberFilterData.toNumber < this.numberFilterData.fromNumber) {
            this.numberFilterForm.form.controls['toNumber'].setErrors({ moreThanFrom: true });
        }
        // let validation = {
        //     required: this.numberFilterData.toNumber == null,
        //     moreThanFrom: this.numberFilterData.toNumber < this.numberFilterData.fromNumber
        // };
        // this.numberFilterForm.form.controls['toNumber'].setErrors(validation);
    }

    OnNumberFilterSubmit() {
        let requestData = {
            uid: this.userId,
            level: this.tlevel,
            newTableName: this.numberFilterData.dataSetname,
            oldTableName: this.tname,
            fromNumber: this.numberFilterData.fromNumber,
            toNumber: this.numberFilterData.toNumber,
            absColumnName: this.selectedColumnName,
            selectedFlowId: this.flowId
        };
        this.showNumberFilterLoader = true;
        this.numberFilterData.errorOccured = false;
        this.transformService.numberFilter(requestData).subscribe(
            () => {
                this.showNumberFilterLoader = false;
                this.numberFilterData = { ...this.defaultNumberFilterData };
                this.numberFilterForm.resetForm();
                this.closeNumberFilterMenu();
                this.onSelection();
            }, (err: any) => {
                this.showNumberFilterLoader = false;
                this.numberFilterData.errorOccured = true;
                console.error("Error occured in number filter:: ", err);
            }
        );
    }

    onSubmit() {


        //if (this.radioVal !== null && this.radioVal !== undefined) {
        //this.radioNtselected = false;

        if (this.radioVal == "workflow") {
            this.submitPipeline = false;
            this.submitWorkflow = true;
            if (this.flowSelected !== null && this.flowSelected !== undefined) {
                this.flowNtSelected = false;
                this.onSelection();
                this.fetchPreviewdata();
                this.fetchScript(true);
                this.removeWranglingModals();
            }
        }
        else {
            this.submitPipeline = true;
            this.submitWorkflow = false;

            if (this.pipelineUserName !== null && this.pipelineUserName !== undefined) {
                this.showUserNtSel = false;
            }
            if (this.pipelineTable !== null && this.pipelineTable !== undefined) {
                this.tblNtSel = false;
            }
            if (this.showUserNtSel == false && this.tblNtSel == false) {
                this.onSelection();
            }
        }
        //}
        // else {
        // 	this.radioNtselected = true;
        // 	this.submitWorkflow = true;
        // }
    }

    closeCopyPipeline() {
        this.copyPipelineForm.resetForm();
    }

    closeTransform() {
        this.radioVal = "workflow";
        this.radioValue = "workflow";
        $("#transform:input[value='workflow']").attr('checked', 'checked');
        $("#transform:input[value='pipeline']").attr('checked', false);
        this.submitWorkflow = false;
        this.submitPipeline = false;
    }

    decorateLink(eachValue) {
        eachValue = eachValue + "";

        if ((eachValue.substr(eachValue.indexOf('.') + 1)) === 'jpg') {
            return true;
        }
        else { return false; }
    }

    removeWranglingModals() {
        this.findAndReplaceForm.resetForm();
        this.dateFilterForm.resetForm();
        this.concatColumnForm.resetForm();
        this.numberFilterForm.resetForm();
        $('.find-replace-wrapper').addClass("hide");
        $('.date-filter-wrapper').addClass("hide");
        $('.concat-columns-wrapper').addClass("hide");
        $('.number-filter-wrapper').addClass("hide");
        $(".data-export-container .find-data-wrapper").removeClass("edit");
        this.showLoader = false;
    }

    quickWrangleClose() {
        $(".content-wrapper").show();
        $(".main-header-wrapper").show();
        $(".content-wrapper2").hide();
        $(".main-header-wrapper2").hide();
        $(".content-wrapper3").hide();
        this.showLoader = false;
    }
    quickWrangleOpen() {
        this.wrangleTables = [];
        $(".content-wrapper").hide();
        $(".main-header-wrapper").hide();
        $(".content-wrapper2").show();
        $(".main-header-wrapper2").show();
        $(".content-wrapper3").hide();
        this.showLoader = true;
        console.log("flowid is", this.flowId);
        this.transformService.wrangleTablesList(this.flowId).subscribe((Response: any) => {
            console.log("response is", Response);
            this.wrangleTables = JSON.parse(Response._body);
            console.log("wrangling tables", this.wrangleTables);
            this.showLoader = false;
        }
        )
    }
    openWranglePreview() {
        $(".content-wrapper").hide();
        $(".main-header-wrapper").hide();
        $(".content-wrapper2").hide();
        $(".main-header-wrapper2").show();
        $(".content-wrapper3").show();
    }

    createWrangleJSON(e: any, table: any) {
        console.log("clicked event", e);
        console.log("clicked event", e.target.checked);
        console.log("clicked event", e.target.value);
        if ($("#body-" + table).find("input:checked").length > 0) {
            console.log("inside main checkbox condition");
            // ($("#header-" + table).find("checkbox"));
            $("#header-" + table).find('input[type=checkbox]').prop('checked', true);
        }
        else {
            $("#header-" + table).find('input[type=checkbox]').prop('checked', false);
        }
        console.log("table ", table);
        var len = $("#body-" + table).find("input:checked").length;
        console.log("checked checkboxes", len);
    }

    joinTable() {
        this.relatedSrcColumns = [];
        this.relatedDestColumns = [];
        this.wrangleSelTables = {};
        var that = this;
        var arr = [];
        for (let i = 0; i < this.wrangleTables.length; i++) {
            if ($("#header-" + this.wrangleTables[i].tbl).find('input[type=checkbox]').is(':checked')) {
                this.wrangleSelTables[this.wrangleTables[i].tbl] = [];
                $("#body-" + this.wrangleTables[i].tbl).find('input[type=checkbox]').each(function () {
                    if (this.checked) {
                        arr.push(this.value);
                        console.log("array value", arr);
                    }
                })
                console.log("after array push", arr);
                this.wrangleSelTables[this.wrangleTables[i].tbl] = arr;
                arr = [];
                console.log("selected wrangle", this.wrangleSelTables);
            }
        }
        console.log("selected wrangle2", this.wrangleSelTables);
    }
    // joinTable() {
    //     let that = this;
    //     for (let i = 0; i < this.wrangleTables.length; i++) {
    //         let a = [];
    //         this.sampleJson[this.wrangleTables[i].tbl] = a;
    //     }
    //     for (let i = 0; i < this.wrangleTables.length; i++) {
    //         console.log(i);
    //         $("#body-" + this.wrangleTables[i].tbl).find('input[type=checkbox]').each(function () {
    //             if (this.checked) {
    //                 that.sampleJson[that.wrangleTables[i].tbl].push(this.value);
    //                 if (that.wrangleSelTables.indexOf(that.wrangleTables[i].tbl) == -1) {
    //                     that.wrangleSelTables.push(that.wrangleTables[i].tbl);
    //                 }
    //             }
    //         })
    //     }
    //     let tablLater = JSON.stringify(that.sampleJson);
    //     console.log("sampleJson" + tablLater);
    //     console.log(this.wrangleSelTables);
    //     $("#joinTable").modal('show');

    // }
    sourceTable(selTable) {
        console.log(selTable);
        console.log(this.wrangleSelTables[selTable]);
        this.relatedSrcColumns = this.wrangleSelTables[selTable];
        console.log("relatedSrcColumns" + this.relatedSrcColumns);
    }

    destinationTable(selTable) {
        this.relatedDestColumns = this.wrangleSelTables[selTable];
    }

    submitJoin() {
        this.showLoader = true;
        var colList = [];
        var srcTable = $("#srcTable option:selected").text();
        var destTable = $("#destTable option:selected").text();
        console.log("tables", srcTable, destTable);
        console.log("table columns", this.wrangleSelTables[destTable])
        this.wrangleSelTables[srcTable].forEach(function (obj) {
            colList.push(srcTable + "." + obj);
        })
        this.wrangleSelTables[destTable].forEach(function (obj) {
            colList.push(destTable + "." + obj);
        })
        console.log("colList", colList);
        this.wrangleRequestbody = {
            "task": "",
            "newTableName": "",
            "columnsList": colList,
            "tableColumnJoinTypeList": [
                {
                    "tableColumns": [
                        {
                            "sourceTableName1": srcTable,
                            "sourceColumnName1": $("#srcAttrib option:selected").text(),
                            "sourceTableName2": destTable,
                            "sourceColumnName2": $("#destAttrib option:selected").text()
                        }
                    ],
                    "joinType": $("#joinType option:selected").text()
                }
            ],
            "selectedFlowId": this.flowId,
            "uid": this.userId,
            "level": "60",
            "queryLogicParam": []

        }
        this.transformService.previewJoinedData(this.wrangleRequestbody).subscribe((Response: any) => {
            console.log("Response of preview", Response);
            this.wranglePreview = JSON.parse(Response._body).queryResponse;
            this.openWranglePreview();
            console.log("joined ouput", this.wranglePreview);
            this.showLoader = false;
        })
        // this.openWranglePreview();
        // this.wranglePreview = [["rideid", "accelerometer_z", "accelerometer_y", "accelerometer_x", "rideid", "gyro_z", "gyro_y", "gyro_x"], ["02b1ab3dee476c5750bb6b6fe825a111", -0.093, 0.009000000000000001, 1.016, "02b1ab3dee476c5750bb6b6fe825a111", -0.0029000000000000002, -0.0063, -0.028800000000000003], ["02b1ab3dee476c5750bb6b6fe825a111", -0.093, 0.009000000000000001, 1.016, "02b1ab3dee476c5750bb6b6fe825a111", -0.0029000000000000002, -0.0063, -0.028800000000000003], ["02b1ab3dee476c5750bb6b6fe825a111", -0.093, 0.009000000000000001, 1.016, "02b1ab3dee476c5750bb6b6fe825a111", -0.0029000000000000002, -0.0063, -0.028800000000000003]];
        console.log("body is", this.wrangleRequestbody);
        console.log("joined ouput", this.wranglePreview);
    }

    submitFunction() {
        this.showLoader = true;
        var arr = [];
        arr.push($('#functions').val());
        this.wrangleRequestbody["queryLogicParam"] = arr;
        console.log("funtions", this.wrangleRequestbody);
        this.transformService.previewJoinedData(this.wrangleRequestbody).subscribe((Response: any) => {
            console.log("Response of preview", Response);
            if (JSON.parse(Response._body).statusCode != 500) {
                this.wranglePreview = [];
                this.wranglePreview = JSON.parse(Response._body).queryResponse;
                this.showLoader = false;
            }
            console.log("joined ouput", this.wranglePreview);
        })
    }

    createWrangleTable() {
        this.showLoader = true;
        this.wrangleRequestbody["newTableName"] = $('#targetTableInput').val();
        this.transformService.createWrangleTable(this.wrangleRequestbody).subscribe((Response: any) => {
            console.log("Table Created Successfully");
            this.quickWrangleClose();
            this.fetchLineageDiagram("flowId", this.flowId);
            this.showLoader = false;
        })
    }

   
}

