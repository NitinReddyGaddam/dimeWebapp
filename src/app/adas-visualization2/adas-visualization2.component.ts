import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Adasvisualizationservice2 } from './adas-visualization.service2';
import { ViewEncapsulation } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { inherits } from 'util';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
declare let google: any;


@Component({
  // selector: 'section-content',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './adas-visualization2.component.html',
  styleUrls: ['../../assets/css/adasvisualization2.css'],
  providers: [Adasvisualizationservice2]
})
export class AdasVisualizationComponent2 implements OnInit, AfterViewInit, OnDestroy {

  constructor(private appService: Adasvisualizationservice2, private sanitizer: DomSanitizer) {}
  jsondata: any;
  chartdata = [];
  searchStr;
  acc_data : Array<Array<any>>=[];
  steer_data : Array<Array<any>>=[];
  initLat ;
  initLng;
  vin: "1H2Y8HAJU8I112347";
  sessionid: "000e0252-8523a4a9";
  velocity_index = "steer_rec";
  acce_index = "brake_info";
  gps_index = "gps_fix";
  image_index = "image_metadata";
  zoom: number = 14;
  coordinates = [];
  imgData = [];
  minSlider;
  maxSlider;
  ros_meta :Array<any> ;
  imgUrl = "http://172.25.118.30:50075/webhdfs/v1/user/root/poc/RosEsImages/camera_image-color_compressed/1542665934259552157.jpg?op=OPEN&amp;namenoderpcaddress=INHYDSPBDMN1.tcs.com:8020&amp;offset=0"
  vel_data = [["Time", ""]];
  pointer=[];
  icon={
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    strokeColor: "red",
    scale: 3
  }
  selectedRow :Number;
  socket = new WebSocket('ws://172.25.118.25:8083/socket');
  ngOnInit() {
    this.socket.onopen = function(event) {
      console.log("WebSocket is open now.");
    };
    this.searchStr = "speed > 5.16";
    $(".chart").hide();
    $(".maps").hide();
    $(".topic-header").hide();
    $(".image").hide();
    // this.ros_meta=[{ VIN: "VELMADAFME", SESSION: "514156456165415" }];
    var body={"index":"metadata_ros",
    "isPreview":true
    }
    this.appService.getRosMetadata(body).subscribe((Response:any)=>{
    this.ros_meta=Response;
    console.log("ros metadata",this.ros_meta);
    }

    )
    $('tr').click(function () {
      alert("hi");
      var tableData = $(this).children('td').map(function () {
        return $(this).text();
    }).get();
    console.log("tableData"+tableData);
  });
  }

  submitFunction() {
    this.plot(this.searchStr);
  }


  plot(queryString) {
    this.pointer=[];
    $(".chart").hide();
    $(".maps").hide();
    $(".topic-header").hide();
    $(".image").hide();
    this.appService.getEs(queryString, this.vin, this.sessionid).subscribe((Response: any) => {
      Response.forEach(function (obj) {
        console.log
        if (obj.index == "velocity") {
          
          this.steer_data=[];
          obj.sourceMap.forEach(function (rec) {
            this.steer_data.push([new Date(rec[1]*1000), parseFloat(rec[0].toFixed(2))]);
          }.bind(this)
          )
          console.log("steer data:", this.steer_data);
          this.velChart();
        }
        else if (obj.index == "acceleration") {
          this.acc_data=[];
          obj.sourceMap.forEach(function (rec) {
            this.acc_data.push([new Date(rec[1]*1000), parseFloat(rec[0].toFixed(2))]);
          }.bind(this)
          )
          console.log("acc_data:", this.acc_data);
          this.acceChart();
          $(".chart").show();
        }
        else if (obj.index == "gps") {
          this.coordinates = [];
          obj.sourceMap.forEach(function (rec) {
            this.coordinates.push({ "latitude": rec[0], "longitude": rec[1], "timeStamp": rec[2] });
          }.bind(this)
          )
          // console.log("gps data:", gps_data);
          // this.coordinates = gps_data;
          this.initLat = this.coordinates[0].latitude;
          this.initLng = this.coordinates[0].longitude;
          console.log("coordinates", this.coordinates);
          $(".maps").show();
        }
        else if (obj.index == "image") {
          this.imgData=[];
          console.log("inside image")
          obj.sourceMap.forEach(function (rec) {
            this.imgData.push(rec[0].split('.')[0]);
          }.bind(this))
          console.log("images", this.imgData);
          this.minSlider = 0;
          this.maxSlider = this.imgData.length - 1;
          console.log("min and max slider", this.minSlider, "--", this.maxSlider);
          $(".topic-header").show();
          $(".image").show();
        }
      }.bind(this)
      )
    })
  }



  acceChart() {
    let that = this;
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      console.log("inside drawchart"+typeof that.acc_data);
      var acceData = new google.visualization.DataTable();
      console.log("inside drawchart");
      acceData.addColumn('date', 'Date');
      acceData.addColumn('number', 'Acceleration');
      // acceData.addColumn({type:'boolean', role:'certainty'});

      acceData.addRows(that.acc_data);
      console.log("Acce graph data", acceData);
      var date_formatter = new google.visualization.DateFormat({
        pattern: "MMM dd, yyyy hh:mm:ss"
      });
      date_formatter.format(acceData, 0);

      var options = {
        width: 432,
        height: 180,
        title: 'Acceleration With Respect To Time',
        // curveType: 'function',
        legend: { position: 'none' },
        chartArea: {'width': '85%', 'height': '80%'},
        tooltip: {
          textStyle: {
            color: 'blue',
            italic: true
          },
          hAxis: {
            format: 'dd.MM.yyyy'
          },
          showColorCode: true
        },
       // hAxis: { textPosition: 'none' },
      };
      console.log("+acceData+" + acceData);
      var chart = new google.visualization.LineChart(document.getElementById('acce-chart'));
      chart.draw(acceData, options);
    }
  }

  velChart() {
    let that = this;

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var velData = new google.visualization.DataTable();
      velData.addColumn('date', 'Date');
      velData.addColumn('number', 'Speed');
      velData.addRows(that.steer_data);
      var date_formatter = new google.visualization.DateFormat({
        pattern: "MMM dd, yyyy hh:mm:ss"
      });
      date_formatter.format(velData, 0);
      var options = {
        width: 432,
        height: 180,
        title: 'Speed With Respect To Time',
        // curveType: 'function',
        legend: { position: 'none' },
        chartArea: {'width': '85%', 'height': '80%'},
        tooltip: {
          textStyle: {
            color: 'blue',
            italic: true
          },
          hAxis: {
            format: 'dd.MM.yyyy'
          },
          showColorCode: true
        },
        //hAxis: { textPosition: 'none' },
      };

      var chart = new google.visualization.LineChart(document.getElementById('veh-chart'));
      chart.draw(velData, options);

    }
  }


  ngAfterViewInit() {
    console.log("view initialised");
    $('.right-part .container .chart-box .chart div div').css("position","inherit");
  }
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  showVal(val) {
    console.log("slider value", val);
    this.socket.onmessage = function(event) {
      this.imgUrl= this.sanitizer.bypassSecurityTrustUrl("data:image/jpg;base64, " +event.data);
    }.bind(this);
  this.socket.send(this.imgData[val]+".jpg");
    console.log("slider value", val);
    $("#imageTimeStamp").text(new Date(this.imgData[val] / 1000000));
    console.log("time in sec",this.imgData[val].substring(0,10));
    for(let i=0;i<this.coordinates.length;i++)
    {
     if(this.coordinates[i].timeStamp==this.imgData[val].substring(0,10))
      {
        console.log("found match");
        this.pointer=[];
        this.pointer=this.coordinates[i];
        break;
      }
    }
  }

  selectVin(e,index){
    this.selectedRow=index;
    console.log("VIN",e[3]);
    console.log("session",e[2]);
    this.vin=e[3];
    this.sessionid=e[2];
    this.plot(undefined);
    console.log(e);
    
  }

  ngOnDestroy(){
    this.socket.close();
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
