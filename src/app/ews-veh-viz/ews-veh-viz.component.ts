import { Component, OnInit } from '@angular/core';
import { EWSVehVizService } from './ews-veh-viz.service';
import "../../assets/js/d3.v3.min.js";
import "../../../node_modules/nvd3/build/nv.d3.min.js";
import "../../assets/js/select2.js";

declare var $: any;
declare var d3: any;;

@Component({
    selector: 'section-content',
    templateUrl: './ews-veh-viz.component.html',
    styleUrls: ['../../assets/css/data-ingestion.css','../../assets/css/visualization.css','../../assets/css/all-viz.css', '../../../node_modules/nvd3/build/nv.d3.min.css'],
    providers: [EWSVehVizService]
})
export class EWSVehVizComponent implements OnInit {

    

    selectedCount: string;
    

    tblData: Array<any>;

    showLoader:boolean = false;
    showTable:boolean = false;


    constructor(private ewsvehvizService: EWSVehVizService) { }

    ngOnInit() {
        
      
    }

    selPredCount(count){
        this.selectedCount=count;
    }

    getVehPredData(){
        this.showLoader = true;
       console.log(this.selectedCount);
       this.ewsvehvizService.getVehPredictedData(this.selectedCount).subscribe((Response: any) => {
        this.showLoader = false;
       this.showTable=true;
       
       this.tblData=JSON.parse(Response._body);
       console.log("tblData EWS"+this.tblData);
       for (var i in this.tblData) {
       console.log(this.tblData[i].ownerlocation);
       console.log(this.tblData[i]);
    }
    }, (err: any) => {
        this.showLoader = false;
        
    }); 
    }


}



