import { Component, OnInit } from '@angular/core';
import { IceVisualizationService } from './ice-visualization.service';
import "../../assets/js/d3.v3.min.js";
import "../../../node_modules/nvd3/build/nv.d3.min.js";
import "../../assets/js/select2.js";

declare var $: any;
declare var d3: any;;

@Component({
    selector: 'section-content',
    templateUrl: './ice-visualization.component.html',
    styleUrls: ['../../assets/css/data-ingestion.css', '../../assets/css/visualization.css', '../../assets/css/all-viz.css', '../../../node_modules/nvd3/build/nv.d3.min.css'],
    providers: [IceVisualizationService]
})
export class IceVisualizationComponent implements OnInit {


    wordList: Array<any>;;
    data: Array<any>;
    selectedWord: string;
    selectedWordCount;
    selectedSeg;
    selectedCls;
    selectedFam;

    familyData: Array<any>;
    classData: Array<any>;
    segData: Array<any>;
    tblDataLst;

    segOptions;
    clsOptions;
    famOptions;
    optionsMain;
    matchedUnspcData;
    writeBackStatus;
    writeBackStatusCls;
    clickValue;
    showLoader1: boolean = false;
    showLoader2: boolean = false;
    showLoader3: boolean = false;
    showLoader4: boolean = false;
    showLoader5: boolean = false;
    showLoader6: boolean = false;
    showLoader7: boolean = false;
    showTable: boolean = false;
    showMatchedData: boolean = false;
    showPie: boolean = false;
    showSegment: boolean = false;
    showFamily: boolean = false;
    showClass: boolean = false;

    constructor(private icevisualizationService: IceVisualizationService) { }

    ngOnInit() {
        var that = this;
        this.fetchWords();
        $("#select-col").select2({
            width: 'resolve', // need to override the changed default
            placeholder: 'Select an option'
        });
        $('#select-col').select2().on("change", function () {
            that.checkForMatchedWord($("#select-col option:selected").val());
        });

    }


    fetchWords() {
        var that = this;
        this.icevisualizationService.getWordList().subscribe((Response: any) => {
            // console.log(Response);
            this.wordList = JSON.parse(Response._body);
            $('#select-col').select2().on("change", function () {
                that.checkForMatchedWord($("#select-col option:selected").val());
            });
            // console.log(this.wordList);

        });
    }

    checkForMatchedWord(e) {

        this.showLoader7 = true;
        this.selectedWord = e;
        console.log("selected input" + e + "," + this.selectedWord);
        this.icevisualizationService.checkUnspcTitle(this.selectedWord).subscribe((Response: any) => {
            this.showLoader7 = false;

            console.log(Response);
            this.matchedUnspcData = JSON.parse(Response._body);
            if (this.matchedUnspcData.status == 'Record Not Found') {
                console.log(this.matchedUnspcData.status);
                this.changeSelection();

            } else if (this.matchedUnspcData.status == 'Record Found') {
                console.log(this.matchedUnspcData.status);
                // this.changeSelection();
                this.showMatchedData = true;
                this.matchedUnspcData.statusInfo = "For the selected word following Unspc Title selection is available.";
                if (this.matchedUnspcData.unspcTitle == "null") this.matchedUnspcData.unspcTitle = null;
                if (this.matchedUnspcData.segment == "null") this.matchedUnspcData.segment = null;
                if (this.matchedUnspcData.cls == "null") this.matchedUnspcData.cls = null;
                if (this.matchedUnspcData.family == "null") this.matchedUnspcData.family = null;
                $("#statusModal").modal("show");

            } else {
                this.matchedUnspcData.statusInfo = this.matchedUnspcData.status;
                $("#statusModal").modal("show");
            }

        }, (err: any) => {
            this.showLoader7 = false;
        });


    }

    changeSelection() {
        $("#statusModal").modal("hide");
        this.loadGraph(this.selectedWord);
        this.loadChildGraphs(this.selectedWord, undefined);
        this.loadOptions();
        this.loadTable(this.selectedWord, undefined, undefined, undefined, undefined);

    }

    loadGraph(value) {
        this.writeBackStatus = undefined;


        this.showLoader1 = true;
        this.icevisualizationService.getChartJson(value).subscribe((Response: any) => {
            this.showLoader1 = false;
            this.showPie = true;
            // console.log(Response);
            this.data = JSON.parse(Response._body);
            // console.log("data2  ::"+this.data);
        }, (err: any) => {
            this.showLoader1 = false;
        });



    }

    loadChildGraphs(value, wordMatch) {


        this.loadSegment(value, wordMatch);

        this.loadClass(value, wordMatch, undefined);
        this.loadFamily(value, wordMatch, undefined, undefined);

    }

    loadSegment(value, wordMatch) {
        this.showLoader2 = true;
        this.icevisualizationService.getSegment(value, wordMatch).subscribe((Response: any) => {
            this.showLoader2 = false;
            this.showSegment = true;
            // console.log(Response);
            this.segData = JSON.parse(Response._body);
            // console.log("segment" + this.segData);
        }, (err: any) => {
            this.showLoader2 = false;
        });
    }

    loadClass(value, wordMatch, seg) {
        this.showLoader3 = true;
        this.icevisualizationService.getClass(value, wordMatch, seg).subscribe((Response: any) => {
            this.showLoader3 = false;
            this.showClass = true;
            // console.log(Response);
            this.classData = JSON.parse(Response._body);
            // console.log(this.classData);
        }, (err: any) => {
            this.showLoader3 = false;
        });
    }

    loadFamily(value, wordMatch, seg, cls) {
        this.showLoader4 = true;
        this.icevisualizationService.getFamily(value, wordMatch, seg, cls).subscribe((Response: any) => {
            this.showLoader4 = false;
            this.showFamily = true;
            // console.log(Response);
            this.familyData = JSON.parse(Response._body);
            // console.log(this.familyData);
        }, (err: any) => {
            this.showLoader4 = false;
        });
    }

    loadTable(value, wordMatch, seg, cls, fam) {
        this.showLoader5 = true;
        this.icevisualizationService.getTblData(value, wordMatch, seg, cls, fam).subscribe((Response: any) => {

            this.showTable = true;
            this.showLoader5 = false;
            // console.log(Response._body);
            this.tblDataLst = JSON.parse(Response._body);

            console.log(this.tblDataLst);
        }, (err: any) => {
            this.showLoader5 = false;
        });
    }

    legendClick(e) {
        console.log(e);
        console.log(e.label);
        this.selectedWordCount = e.label;
        this.loadChildGraphs(this.selectedWord, this.selectedWordCount);
        this.loadTable(this.selectedWord, this.selectedWordCount, undefined, undefined, undefined);


    }

    segLegendClick(e) {
        this.selectedSeg = e.label;
        console.log("segLegendClick:::" + this.selectedSeg);
        this.loadClass(this.selectedWord, this.selectedWordCount, this.selectedSeg);
        this.loadFamily(this.selectedWord, this.selectedWordCount, this.selectedSeg, undefined);
        this.loadTable(this.selectedWord, this.selectedWordCount, this.selectedSeg, undefined, undefined);
    }

    clsLegendClick(e) {
        this.selectedCls = e.label;
        console.log("clsLegendClick:::" + this.selectedCls);
        this.loadTable(this.selectedWord, this.selectedWordCount, this.selectedSeg, this.selectedCls, undefined);
        this.loadFamily(this.selectedWord, this.selectedWordCount, this.selectedSeg, this.selectedCls);
    }

    famLegendClick(e) {
        this.selectedFam = e.label;
        console.log("famLegendClick:::" + this.selectedFam);

        this.loadTable(this.selectedWord, this.selectedWordCount, this.selectedSeg, this.selectedCls, this.selectedFam);
    }

    selectdUnspcTitle(data) {
        this.showLoader6 = true;
        console.log(data.unspc_Title + "-" + this.selectedWord + "-" + this.selectedWordCount + "-" + this.selectedSeg + "-" + this.selectedCls + "-" + this.selectedFam);

        this.icevisualizationService.setUnspcTitle(this.selectedWord, data.unspc_Title, this.selectedSeg, this.selectedCls, this.selectedFam).subscribe((Response: any) => {
            this.showLoader6 = false;
            console.log(Response._body);
            if (Response._body == "Added Successfully") {
                this.writeBackStatus = "Your Selection has been updated";
                this.writeBackStatusCls = "success";
            } else {
                this.writeBackStatus = "Error while updating your Selection";
                this.writeBackStatusCls = "failed";;
            }
            // $("#writebackStatusModal").modal("show");
            // setTimeout(() => {
            //     this.writeBackStatusCls=undefined;
            // }, 2000);
            // $('#'+this.writeBackStatusCls).delay(2000).fadeOut('slow')
        }, (err: any) => {
            this.showLoader6 = false;
        });
    }

    loadOptions() {
        var that = this;
        this.segOptions = {
            chart: {
                type: 'pieChart',
                height: 200,
                x: function (d) { return d.value + ' - ' + d.label; },
                y: function (d) { return d.value; },
                showLabels: false,
                showLegend: true,
                legendPosition: "right",
                legendScroll: true,

                addLegendNav: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    },
                    dispatch: {
                        legendDblclick: function (e) {
                            // console.log(e);
                            that.segLegendClick(e);
                        }

                    }
                }
            }
        };

        this.clsOptions = {
            chart: {
                type: 'pieChart',
                height: 200,
                x: function (d) { return d.value + ' - ' + d.label; },
                y: function (d) { return d.value; },
                showLabels: false,
                showLegend: true,
                legendPosition: "right",
                legendScroll: true,

                addLegendNav: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    },
                    dispatch: {
                        legendDblclick: function (e) {
                            // console.log(e);
                            that.clsLegendClick(e);
                        }

                    }
                }
            }
        };

        this.famOptions = {
            chart: {
                type: 'pieChart',
                height: 200,
                x: function (d) { return d.value + ' - ' + d.label; },
                y: function (d) { return d.value; },
                showLabels: false,
                showLegend: true,
                legendPosition: "right",
                legendScroll: true,

                addLegendNav: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    },
                    dispatch: {
                        legendDblclick: function (e) {
                            // console.log(e);
                            that.famLegendClick(e);
                        }

                    }
                }
            }
        };

        this.optionsMain = {
            chart: {
                type: 'pieChart',
                height: 200,
                x: function (d) { return d.label + ' - ' + d.value; },
                y: function (d) { return d.value; },
                showLabels: false,
                showLegend: true,
                legendPosition: "right",


                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    },
                    dispatch: {
                        legendDblclick: function (e) {
                            // console.log(e);
                            that.legendClick(e);
                        }
                        // },
                        // legendClick: function (e) {
                        //     // console.log(e);
                        //     that.loadChildGraphs(that.selectedWord,undefined);

                        // }
                    }
                }
            }
        };


    }

    dummyFunc() {
        console.log("entered fucntion");
    }



}



