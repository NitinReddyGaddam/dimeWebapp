import { Component, OnInit } from '@angular/core';
import { EWSAggVizService } from './ews-agg-viz.service';
import "../../assets/js/d3.v3.min.js";
import "../../../node_modules/nvd3/build/nv.d3.min.js";
import "../../assets/js/select2.js";

declare var $: any;
declare var d3: any;;

@Component({
    selector: 'section-content',
    templateUrl: './ews-agg-viz.component.html',
    styleUrls: ['../../assets/css/data-ingestion.css','../../assets/css/visualization.css','../../assets/css/all-viz.css', '../../../node_modules/nvd3/build/nv.d3.min.css'],
    providers: [EWSAggVizService]
})
export class EWSAggVizComponent implements OnInit {

    

    modelList: Array<any>;
    selectedModel;
    selectedMonth;
    showLoader:boolean = false;
    data;
    options;


    constructor(private ewsaggvizService: EWSAggVizService) { }

    ngOnInit() {
        this.ewsaggvizService.modelList().subscribe((Response: any) => {
            console.log("Model EWS"+JSON.parse(Response._body));
            this.modelList = JSON.parse(Response._body);  
        }); 
      
    }

    selectModel(model){
        console.log(model);
        this.selectedModel=model;
       
    }

    selectMonth(month){
        console.log(month);
        this.selectedMonth=month;
        
    }
    
    getPredData(){
        this.showLoader = true;
       console.log(this.selectedModel,this.selectedMonth);
       this.ewsaggvizService.getPredictedData(this.selectedModel,this.selectedMonth).subscribe((Response: any) => {
        this.showLoader = false;
       console.log("Model EWS"+JSON.parse(Response._body));
       this.data=JSON.parse(Response._body);
    }, (err: any) => {
        this.showLoader = false;
        
    }); 
    this.options = {
        chart: {
            type: 'discreteBarChart',
            height: 460,
            width: 900,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 100
            },
            x: function (d) { return d.label; },
            y: function (d) { return d.value; },
            showValues: true,
            // staggerLabels = false,
            noData: '',
            valueFormat: function (d) {
                return d3.format(',.2f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                // axisLabelDistance: -5
                
            }
        }
    }
    }
    


}



