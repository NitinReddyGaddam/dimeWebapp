import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import "../../assets/js/d3.v3.min.js";
import "../../../node_modules/nvd3/build/nv.d3.min.js";
import { DataAccessService } from './data-access.service';
import { identifierModuleUrl } from '../../../node_modules/@angular/compiler';

declare var $: any;

@Component({
    selector: 'section-content',
    templateUrl: './data-access.component.html',
    styleUrls: ['../../assets/css/data-access.css', '../../../node_modules/nvd3/build/nv.d3.min.css'],
    providers: [DataAccessService]
})
export class DataAccessComponent implements OnInit {

    uId;
    rawStagingData: Array<any>;
    landingStagingData: Array<any>;
    processedStagingData: Array<any>;
    tableInfo = {};
    chUserGroupTable;
    chUserGroup;
    chStage;
    xcolArr = [];
    ycolArr = [];
    options1;
    data1: Array<any>;
    options2;
    data2: Array<any>;
    options3;
    data3: Array<any>;
    showLandingLoader: boolean = false;
    showProcessedLoader: boolean = false;
    showRawLoader: boolean = false;
    showGraphLoader1: boolean = false;
    showGraphLoader2: boolean = false;
    showGraphLoader3: boolean = false;
    charDataNotFound1: boolean = false;
    charDataNotFound2: boolean = false;
    charDataNotFound3: boolean = false;
    noDataMessage: string = "No Data Available !";
    showGrpNotSelMesg: boolean = true;

    constructor(private dataAccessService: DataAccessService) { }
    ngOnInit() {
        this.uId = localStorage.getItem('uId');
        this.fetchRawTables();
        this.fetchLandingTables();
        this.fetchProcessedTables();
    }

    fetchRawTables() {
        this.dataAccessService.stagingData(this.uId, "raw").subscribe((Response: any) => {
            console.log("Fetching Raw Tables")
            console.log("Response: ", Response);
            this.rawStagingData = JSON.parse(Response._body);
            console.log(this.rawStagingData);
        })
    }

    fetchLandingTables() {
        this.dataAccessService.stagingData(this.uId, "landing").subscribe((Response: any) => {
            console.log("Fetching landing Tables")
            console.log("Response: ", Response);
            this.landingStagingData = JSON.parse(Response._body);
            console.log(this.landingStagingData);
        })
    }

    fetchProcessedTables() {
        this.dataAccessService.stagingData(this.uId, "processed").subscribe((Response: any) => {
            console.log("Fetching Raw Tables")
            console.log("Response: ", Response);
            this.processedStagingData = JSON.parse(Response._body);
            console.log(this.processedStagingData);
        })
    }

    fetchRawColumnData(tname: String, level: Number, index: number) {
        if (this.rawStagingData[index].colLoad == undefined) {
            let metadata = [];
            this.showRawLoader = true;
            this.dataAccessService.fetchMetadata(tname, level).subscribe((Response: any) => {
                this.showRawLoader = false;
                metadata = JSON.parse(Response._body);
                this.rawStagingData[index].Columns = metadata;
                this.rawStagingData[index].colLoad = true;
                console.log(this.rawStagingData);
                //$('.data').css('display', 'block');
                if (this.rawStagingData[index].infoLoaded == undefined) {
                    this.dataAccessService.fetchTableInfo(tname, level).subscribe((Response: any) => {
                        var res = JSON.parse(Response._body);
                        console.log(res);
                        this.rawStagingData[index].dataPath = res["Path of data"];
                        this.rawStagingData[index].createDate = res["Creation Date"];
                        this.rawStagingData[index].rowCount = res["Row Count"];
                        this.rawStagingData[index].size = res["Dataset Size"];
                        console.log(this.rawStagingData);
                        this.rawStagingData[index].infoLoaded = true;
                    }
                    )

                }
            }, (err: any) => {
                this.showRawLoader = false;
            });
        }
    }

    fetchLandingColumnData(tname: String, level: Number, index: number) {
        if (this.landingStagingData[index].colLoad == undefined) {
            let metadata = [];
            this.showLandingLoader = true;
            this.dataAccessService.fetchMetadata(tname, level).subscribe((Response: any) => {
                this.showLandingLoader = false;
                metadata = JSON.parse(Response._body);
                this.landingStagingData[index].Columns = metadata;
                this.landingStagingData[index].colLoad = true;
                console.log(this.landingStagingData);
                //$('.data').css('display', 'block');
                if (this.landingStagingData[index].infoLoaded == undefined) {
                    this.dataAccessService.fetchTableInfo(tname, level).subscribe((Response: any) => {
                        var res = JSON.parse(Response._body);
                        console.log(res);
                        this.landingStagingData[index].dataPath = res["Path of data"];
                        this.landingStagingData[index].createDate = res["Creation Date"];
                        this.landingStagingData[index].rowCount = res["Row Count"];
                        this.landingStagingData[index].size = res["Dataset Size"];
                        console.log(this.landingStagingData);
                        this.landingStagingData[index].infoLoaded = true;
                    });
                }
            }, (err: any) => {
                this.showLandingLoader = false;
            });

        }
    }

    fetchProcessedColumnData(tname: String, level: Number, index: number) {
        console.log("Inside processed column loading");
        if (this.processedStagingData[index].colLoad == undefined) {
            let metadata = [];
            this.showProcessedLoader = true;
            this.dataAccessService.fetchMetadata(tname, level).subscribe((Response: any) => {
                this.showProcessedLoader = false;
                metadata = JSON.parse(Response._body);
                this.processedStagingData[index].Columns = metadata;
                this.processedStagingData[index].colLoad = true;
                console.log(this.processedStagingData);
                //$('.data').css('display', 'block');
                if (this.processedStagingData[index].infoLoaded == undefined) {
                    this.dataAccessService.fetchTableInfo(tname, level).subscribe((Response: any) => {
                        var res = JSON.parse(Response._body);
                        console.log(res);
                        this.processedStagingData[index].dataPath = res["Path of data"];
                        this.processedStagingData[index].createDate = res["Creation Date"];
                        this.processedStagingData[index].rowCount = res["Row Count"];
                        this.processedStagingData[index].size = res["Dataset Size"];
                        console.log(this.processedStagingData);
                        this.processedStagingData[index].infoLoaded = true;
                    }
                    )
                }
            }, (err: any) => {
                this.showProcessedLoader = false;
            });

        }
    }

    setUserGroup(tname: String, group: String, stage: String) {
        this.chUserGroupTable = tname;
        this.chUserGroup = group;
        this.chStage = stage;
        this.showGrpNotSelMesg = true;
        console.log("table name: ", tname);
        console.log("Group: ", group);
        console.log("Stage :", stage);
    }
    validateChngeGrpForm() {
        if (this.chUserGroup !== "" && this.chUserGroup !== null && this.chUserGroup !== undefined) {
            this.showGrpNotSelMesg = true;
            this.changeUserGroup();
        }
        else {
            this.showGrpNotSelMesg = false;
        }
    }

    changeUserGroup() {
        this.dataAccessService.changeUserGroup(this.chUserGroupTable, this.chUserGroup).subscribe((Response: any) => {
            if (this.chStage == "raw") {
                this.fetchLandingTables();
            }
            else if (this.chStage == "landing") {
                this.fetchLandingTables();
            }
            else if (this.chStage == "processed") {
                this.fetchProcessedTables();
            }
            this.chStage = '';
            this.chUserGroup = '';
            this.chStage = '';
        }
        )
    }

    loadGraph(tname: String, level: Number, cname: String, ind: number) {
        console.log("index :", ind);
        this.data1 = [];
        this.data2 = [];
        this.data3 = [];

        this.charDataNotFound1 = false;
        this.charDataNotFound2 = false;
        this.charDataNotFound3 = false;

        console.log(tname, level, cname);
        this.options1 = {
            chart: {
                type: 'discreteBarChart',
                height: 300,
                // margin: {
                //     top: 20,
                //     right: 20,
                //     bottom: 50,
                //     left: 55
                // },
                x: function (d) { return d.label; },
                y: function (d) { return d.value; },
                showValues: true,
                noData: '',
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                // xAxis: {
                //     axisLabel: 'X Axis'
                // },
                yAxis: {
                    axisLabel: 'Record Count',
                    axisLabelDistance: -10
                }
            }
        }
        this.options2 = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function (d) { return d.label; },
                y: function (d) { return d.value; },
                showLabels: true,
                duration: 500,
                noData: '',
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                // legend: {
                //     margin: {
                //         top: 5,
                //         right: 35,
                //         bottom: 5,
                //         left: 0
                //     }
                // }
            }
        }
        this.options3 = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 300,
                x: function (d) { return d.label; },
                y: function (d) { return d.value; },
                showLabels: true,
                showLegend: false,
                noData: '',
                // noData: "Loading Graph ...",
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                showControls: false,
            }
        }

        this.showGraphLoader1 = true;
        this.showGraphLoader2 = true;
        this.showGraphLoader3 = true;
        this.graphservice1(tname, level, cname);
    }

    graphservice1(tname, level, cname) {
        this.dataAccessService.getRecordCountGraph(tname, level, cname).subscribe((Response: any) => {
            this.showGraphLoader1 = false;
            try {
                console.log("pie output :", Response);
                this.data1 = Response.json();
                this.graphservice2(tname, level, cname);
            } catch (e) {
                this.charDataNotFound1 = true;
                this.graphservice2(tname, level, cname);
            }
        }, (err: any) => {
            this.showGraphLoader1 = false;
            this.charDataNotFound1 = true;
            this.graphservice2(tname, level, cname);
        });
    }

    graphservice2(tname, level, cname) {
        this.dataAccessService.getDistributionGraph(tname, level, cname).subscribe((Response: any) => {
            this.showGraphLoader2 = false;
            try {
                console.log("pie output :", Response);
                this.data2 = Response.json();
                this.graphservice3(tname, level, cname);
            } catch (e) {
                this.charDataNotFound2 = true;
                this.graphservice3(tname, level, cname);
            }
        }, (err: any) => {
            this.showGraphLoader2 = false;
            this.charDataNotFound2 = true;
            this.graphservice3(tname, level, cname);
        });
    }
    graphservice3(tname, level, cname) {
        this.dataAccessService.getPatternGraph(tname, level, cname).subscribe((Response: any) => {
            this.showGraphLoader3 = false;
            try {
                console.log("multibar output :", Response);
                this.data3 = Response.json();
            } catch (e) {
                this.charDataNotFound3 = true;
            }
        }, (err: any) => {
            this.showGraphLoader3 = false;
            this.charDataNotFound3 = true;
        });
    }
}
