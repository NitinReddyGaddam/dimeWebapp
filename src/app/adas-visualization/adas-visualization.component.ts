import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Adasvisualizationservice } from './adas-visualization.service';
import { NouiFormatter, NouisliderModule } from "ng2-nouislider";
import { ViewEncapsulation } from '@angular/core';
declare var $: any;


@Component({
  // selector: 'section-content',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './adas-visualization.component.html',
  styleUrls: ['../../assets/css/adasvisualization.css'],
  providers: [Adasvisualizationservice, DecimalPipe]
})
export class AdasVisualizationComponent implements OnInit, AfterViewInit {

  constructor(private appService: Adasvisualizationservice, private noUiSliderComponent: NouisliderModule, private decimalPipe: DecimalPipe) { }
  timeFrameData = [];
  finalMediaList = [];
  date: string;
  download;
  title = 'app';
  finalDate: any;
  someKeyboardConfig = {
    connect: true,
    start: [10000, 20000],
    step: 1000,
    tooltips: [new TimeFormatter(this.decimalPipe), new TimeFormatter(this.decimalPipe)],
    range: {
      min: 0,
      max: 86400000,
    },
    behaviour: 'drag',
  };

  @ViewChild('slider', { read: ElementRef }) slider: ElementRef;
  sliderRange;
  showVideo: boolean = false;
  ngOnInit() {
    this.fetchTimeFrames();
    console.log("time frame data:", this.timeFrameData);
    $("#Date").datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat: 'yy.mm.dd'
    }).on('change', (e: any) => {
      //this.onChange(e.target.value);
      //console.log("Date changed for date picker :: ", e);
      console.log(e.target.value);
      this.date = e.target.value;

    });
    $(".date-icon").click(function (e) {
      $(this).parent().find("input").datepicker("show");
      e.preventDefault();
    });

  }

  ngAfterViewInit() {

    this.func();
  }

  func() {
    console.log("started func", this.timeFrameData);
    const connect = this.slider.nativeElement.querySelectorAll('.noUi-connect');
    const classes = ['c-1-color', 'c-2-color', 'c-3-color'];
    console.log(connect.length);
    for (let i = 0; i < connect.length; i++) {
      connect[i].classList.add(classes[i]);
    }
    console.log("inside range options", this.timeFrameData);
  }

  fetchVideos() {
    this.finalMediaList = [];
    console.log("range", this.sliderRange);
    var unixdate = Date.parse(this.date);
    console.log("unix date:", unixdate, typeof (unixdate));
    var unixTimeStamp = [];
    unixTimeStamp[0] = unixdate + this.sliderRange[0];
    unixTimeStamp[1] = unixdate + this.sliderRange[1];
    console.log("unixtimestamp:", unixTimeStamp);
    this.timeFrameData.forEach(function (obj) {

      console.log("obj starttime", obj.startTime);
      console.log("obj endtime", obj.endTime);
      if (((obj.endTime > unixTimeStamp[0]) && (obj.endTime < unixTimeStamp[1])) || ((obj.startTime < unixTimeStamp[1]) && (obj.endTime > unixTimeStamp[1])) || ((obj.startTime > unixTimeStamp[0]) && (obj.endTime < unixTimeStamp[1]))) {
        this.finalMediaList.push(obj);
        console.log("pushed object", obj);
        obj = {};
        console.log("inside loading final media list");
      }
    }.bind(this))
    for (var i = 0; i < this.finalMediaList.length; i++) {
      this.finalMediaList[i]["fetchvid"] = false;
      this.finalMediaList[i]["fetchimg"] = true;
      this.finalMediaList[i]["vidUrl"] = "http://172.25.118.30:50075/webhdfs/v1/user/root/poc/mov/" + this.finalMediaList[i].jsonFilename + ".mov?op=OPEN&namenoderpcaddress=INHYDSPBDMN1.tcs.com:8020&offset=0";
      this.finalMediaList[i]["imgUrl"] = "http://172.25.118.30:50075/webhdfs/v1/user/root/poc/jpg/" + this.finalMediaList[i].jsonFilename + ".jpg?op=OPEN&namenoderpcaddress=INHYDSPBDMN1.tcs.com:8020&offset=0";
      this.finalMediaList[i]["epoachStartTime"] = new Date(this.finalMediaList[i]["startTime"]);
      this.finalMediaList[i]["epoachEndTime"] = new Date(this.finalMediaList[i]["endTime"]);

    }
    console.log("final video data after editing:", this.finalMediaList);
    // console.log("final image list", this.finalMediaList[0].jsonFilename);
    // console.log("vide name:", this.finalMediaList[0].jsonFilename);
    // this.download = "http://inhydspbdsl2.tcs.com:50075/webhdfs/v1/user/root/poc/jpg/" + finalImageList[0].jsonFilename + ".jpg?op=OPEN&namenoderpcaddress=INHYDSPBDMN1.tcs.com:8020&offset=0";
    //this.sampleVideo = "http://inhydspbdsl2.tcs.com:50075/webhdfs/v1/user/root/poc/mov/" + finalImageList[0].jsonFilename + ".mov?op=OPEN&namenoderpcaddress=INHYDSPBDMN1.tcs.com:8020&offset=0";
    // this.showVideo = true;
  }

  toggleMedia(index) {
    this.finalMediaList[index].fetchimg = false;
    this.finalMediaList[index].fetchvid = true;
  }
  
  fetchTimeFrames() {
    // this.appService.timeFrames('just_data').subscribe((Response: any) => {
      this.appService.timeFrames('just_data').subscribe((Response: any) => {
      console.log("es response", Response);
      var final_hits = [];
      final_hits = Response.hits.hits;
      console.log("hits only:", final_hits);
      console.log("Final hits length", final_hits.length);
      var obj;
      for (var i = 0; i < final_hits.length; i++) {
        obj = {};
        obj["startTime"] = final_hits[i]._source.starttime;
        obj["endTime"] = final_hits[i]._source.endtime;
        obj["jsonFilename"] = final_hits[i]._source.json_filename;
        this.timeFrameData.push(obj);
      }
    }, err => {
      alert("Something went wrong ! Plese reload");
    }
    )
    console.log("fetched time frames:,", this.timeFrameData);
  }
}

export class TimeFormatter implements NouiFormatter {
  constructor(private decimalPipe: DecimalPipe) { };

  to(value: number): string {
    let h = Math.floor(value / 3600000);
    let m = value % 60000;
    let output = this.decimalPipe.transform(h, '2.0') + ":" + this.decimalPipe.transform(m, '2.0');
    return output;
  }

  from(value: string): number {
    return Number(value.split(":")[0]) * 60 + Number(value.split(":")[1]);
  }
}