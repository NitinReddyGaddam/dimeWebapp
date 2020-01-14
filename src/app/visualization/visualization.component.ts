import { Component, OnInit } from '@angular/core';
import { VisualizationService } from './visualization.service';
import "../../assets/js/d3.v3.min.js";
import "../../assets/js/select2.js";
import "../../../node_modules/nvd3/build/nv.d3.min.js";
import { NgForm } from '@angular/forms';

declare var $: any;
declare var d3: any;

@Component({
    selector: 'section-content',
    templateUrl: './visualization.component.html',
    styleUrls: ['../../assets/css/visualization.css', '../../../node_modules/nvd3/build/nv.d3.min.css'],
    providers: [VisualizationService]
})
export class VisualizationComponent implements OnInit {


    userId;
    tblLevelList: Array<any>;
    SeltblLevelList=[];
    selectedTbl: string;
    colList = [];
    selectedLevel: string;
    selectedGraph: string;
    selectedAggregation: string;
    newid: string;
    xcolArr = [];
    ycolArr = [];
    options;
    data: Array<any>;
    data2;
    showLoader: boolean = false;
    noDataMessage: string = "No Data Available.";
    charDataNotFound: boolean = false;
    xColMultiBarErrMsg: boolean = false;
    xColErrMsg: boolean = false;
    aggreagtionErrMsg: boolean = false;
    yColErrMsg: boolean = false;
    submitted: boolean = false;
    xColMultipleColErr: boolean = false;

    constructor(private visualizationService: VisualizationService) { }

    ngOnInit() {
        var that=this;
        this.userId = localStorage.getItem('uId');
        this.fetchTblList();
        $('#sel-box').select2().on("change", function() { 
            that.selectColumns($("#sel-box option:selected").val());
          });
    }

    fetchTblList() {
        this.visualizationService.getTableList(this.userId).subscribe((Response: any) => {
            this.tblLevelList = Response.json();
            console.log(this.tblLevelList);
            var obj={};
            this.tblLevelList.forEach(function(item,i)
            {
                console.log("iteration:",i);
                console.log("item",item);
                obj["id"]=item["level"]+"+"+item["tblName"];
                obj["text"]=item["tblName"];
                this.SeltblLevelList.push(obj);
                obj={};
            }.bind(this)
            )
            console.log("select table list",this.SeltblLevelList);

        });
    }
    selectColumns(value) {
        console.log("value is",value);
        this.colList = [];
        console.log(this.tblLevelList);
        this.xcolArr.length = 0;
        this.ycolArr.length = 0;
        let tbl = value.substr(0, value.indexOf('+')); 
        let level = value.substr(value.indexOf('+')+1);
        console.log(tbl+"vanisdfsdfsdfvani"+level);
        for (var i in this.tblLevelList) {
            if (this.tblLevelList[i].tblName == tbl && this.tblLevelList[i].level == level) {
                this.selectedLevel = level;
                this.selectedTbl = tbl;
            }
        }
        this.visualizationService.getColList(this.selectedTbl, this.selectedLevel).subscribe((Response: any) => {
            this.colList = JSON.parse(Response._body);
            console.log("collist" + this.colList);
            console.log("Response ", Response);
        });
    }



    selectAggregation(value) {
        this.selectedAggregation = value;
        if (this.submitted) {
            if (this.selectedAggregation == "undefined" || this.selectedAggregation == null || this.selectedAggregation == "") {
                this.aggreagtionErrMsg = true;
            }
            else {
                this.aggreagtionErrMsg = false;
            }
        }
    }


    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        this.newid = ev.target.id;
    }


    drop(ev) {
        console.log("ev: ", ev.dataTransfer);
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");
        // console.log(data);
        // console.log("data: ", $("#"+data).text());
        if (ev.target.id == "x-col-selection") {
            this.xcolArr.push($("#" + data).text());
        }
        else if (ev.target.id == "y-col-selection") {
            this.ycolArr.push($("#" + data).text());
        }
        if ($("input[name='chart-type']:checked").val() == 'multiBarChart') {
            this.xcolArr.splice(2, this.xcolArr.length - 2);
            this.ycolArr.splice(1, this.ycolArr.length - 1);
        } else {
            this.xcolArr.splice(1, this.xcolArr.length - 1);
            this.ycolArr.splice(1, this.ycolArr.length - 1);
        }
        //   ev.target.appendChild(document.getElementById(data).cloneNode(true));
        //   var type = document.getElementById(this.newid).getAttribute("name");
        //   alert(type);
        console.log("xColArr:" + this.xcolArr);
        console.log("yColArr" + this.ycolArr);
        if (this.submitted) {
            if (($("input[name='chart-type']:checked").val() == 'multiBarChart')) {

                if (this.xcolArr.length < 2) {
                    this.xColMultiBarErrMsg = true;
                }
                else {
                    this.xColMultiBarErrMsg = false;
                }

            }
            else {
                if (this.xcolArr.length < 1) {
                    this.xColErrMsg = true;
                }
                else {
                    this.xColErrMsg = false;
                }
            }

            if (this.ycolArr.length < 1) {
                this.yColErrMsg = true;
            }
            else {
                this.yColErrMsg = false;
            }

        }

    }


    removeItem(arrType, item) {
        if (arrType == "X") {
            let idx = this.xcolArr.indexOf(item);
            console.log("idx: ", idx);
            this.xcolArr.splice(idx, 1);
        }
        else if (arrType == "Y") {
            let idx = this.ycolArr.indexOf(item);
            console.log("idx: ", idx);
            this.ycolArr.splice(idx, 1);
        }

        if (this.submitted) {
            if (($("input[name='chart-type']:checked").val() == 'multiBarChart')) {

                if (this.xcolArr.length < 2) {
                    this.xColMultiBarErrMsg = true;
                }
                else {
                    this.xColMultiBarErrMsg = false;
                }

            }
            else {
                if (this.xcolArr.length < 1) {
                    this.xColErrMsg = true;
                }
                else {
                    this.xColErrMsg = false;
                }
            }

            if (this.ycolArr.length < 1) {
                this.yColErrMsg = true;
            }
            else {
                this.yColErrMsg = false;
            }

        }

    }

    chartType(chartType) {
        if (this.submitted) {
            if (chartType == "multiBarChart") {

                if (this.xcolArr.length < 2) {
                    this.xColMultiBarErrMsg = true;
                    this.xColErrMsg = false;
                }
                else {
                    this.xColMultiBarErrMsg = false;
                    this.xColErrMsg = false;
                }

            }
            else {
                if (this.xcolArr.length < 1 || this.xcolArr.length > 1) {
                    this.xColErrMsg = true;
                    this.xColMultiBarErrMsg = false;
                }

                else {
                    this.xColErrMsg = false;
                    this.xColMultiBarErrMsg = false;
                }
            }

            if (this.ycolArr.length < 1) {
                this.yColErrMsg = true;
            }
            else {
                this.yColErrMsg = false;
            }

        }
    }

    validations() {
        this.submitted = true;
        this.selectedGraph = $("input[name='chart-type']:checked").val();
        if (($("input[name='chart-type']:checked").val() == 'multiBarChart')) {

            if (this.xcolArr.length < 2) {
                this.xColMultiBarErrMsg = true;
            }
        }
        else if (this.xcolArr.length < 1) {
            this.xColErrMsg = true;
        }


        if (this.ycolArr.length < 1) {
            this.yColErrMsg = true;
        }
        if (this.selectedAggregation == "undefined" || this.selectedAggregation == null) {
            this.aggreagtionErrMsg = true;
        }
        if (this.xColMultiBarErrMsg == false && this.xColErrMsg == false && this.yColErrMsg == false && this.aggreagtionErrMsg == false) {
            this.onSubmit();
        }
    }

    onSubmit() {
        this.data = [];
        this.options = {};
        this.selectedGraph = $("input[name='chart-type']:checked").val();
        console.log(this.selectedGraph);
        this.showLoader = true;
        this.charDataNotFound = false;
        this.visualizationService.getChartDetails(this.selectedTbl, this.selectedLevel, this.xcolArr.toString(), this.ycolArr.toString(), this.selectedGraph, this.selectedAggregation).subscribe((Response: any) => {
            this.showLoader = false;
            try {
                this.data = Response.json();
            } catch (e) {
                //Error will happen when response is not convertable to json
                console.error("error occured while converting response to json :: ", e);
                this.charDataNotFound = true;
            }
        }, (err: any) => {
            this.showLoader = false;
            this.charDataNotFound = true;
        });
        if (this.selectedGraph == 'discreteBarChart') {
            this.options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 100
                    },
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showValues: true,
                    noData: '',
                    valueFormat: function (d) {
                        return d3.format(',.4f')(d);
                    },
                    duration: 500,
                    xAxis: {
                        axisLabel: 'X Axis'
                    },
                    yAxis: {
                        axisLabel: 'Y Axis',
                        axisLabelDistance: -10
                    }
                }
            }
        } else if (this.selectedGraph == 'pieChart') {
            this.options = {
                chart: {
                    type: 'pieChart',
                    height: 500,
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showLabels: true,
                    noData: '',
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };

        } else if (this.selectedGraph == 'multiBarChart') {
            this.options = {
                chart: {
                    type: 'multiBarChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 45,
                        left: 45
                    },
                    clipEdge: true,
                    duration: 500,
                    stacked: true,
                    noData: '',
                    xAxis: {
                        axisLabel: 'X Axis',
                        showMaxMin: false,
                        tickFormat: function (d) {
                            return d3.format(',f')(d);
                        }
                    },
                    yAxis: {
                        axisLabel: 'Y Axis',
                        axisLabelDistance: -20,
                        tickFormat: function (d) {
                            return d3.format(',.1f')(d);
                        }
                    }
                }
            };
        }
    }



}
