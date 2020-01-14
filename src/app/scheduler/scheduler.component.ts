import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import "../../assets/js/d3.v3.min.js";
import { ViewEncapsulation } from '@angular/core';
import { SchedulerService } from './scheduler.service';
import * as _ from 'underscore';
import { CommonService } from '../services/common.service';
import { SchedulerFilterPipe } from '../data-ingestion/filter.pipe';

declare var $: any;
declare var d3: any;
declare var require: any

@Component({
    selector: 'section-content',
    encapsulation: ViewEncapsulation.Emulated,
    templateUrl: './scheduler.component.html',
    styleUrls: ['../../assets/css/scheduler.css'],
    providers: [SchedulerService,SchedulerFilterPipe]
})
export class SchedulerComponent implements OnInit, AfterViewInit {
    userId;
    showLoader;
    coordList;
    showWorkflows = false;
    showScheduleBtn = false;
    jobsList;
    filteredCoordList;
    startdate:string;
    enddate:string;
    cronValue;
    selectedFlows = [];
    statusMessage;
    jobId;
    search;
    timezoneList:Array<any>;
    selectedTZone:string="Asia/Kolkata";
    jobTag = (term) => ({id: term, name: term});
    timezoneTag = (term) => ({name: term});
    @ViewChild('schedularForm') form: NgForm;

    constructor(private schedulerFilterPipe : SchedulerFilterPipe,private commonServices: CommonService, private route: ActivatedRoute, private schedulerService: SchedulerService) { }

    ngOnInit() {
       
        this.userId = localStorage.getItem('uId');
        this.fetchJobsList();
        this.fetchcoordlist();
        var moment = require('moment-timezone');
        this.timezoneList=moment.tz.names()
       
        this.cronValue =  $('#cronDiv').cron();
        
       $("#startDate").datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy-mm-dd'
          }).on('change', (e: any) => {
            console.log(e.target.value);
            this.startdate = e.target.value;
            console.log(this.cronValue.cron("value"));
       });
       $("#endDate").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd'
      }).on('change', (e: any) => {
        console.log(e.target.value);
        this.enddate = e.target.value;
        });

        
    }

    ngAfterViewInit() {

    }

    fetchcoordlist() {
        this.showLoader = true;
        this.schedulerService.getCoordList(this.userId).subscribe((Response: any) => {
            this.showLoader = false;
            console.log("Response"+Response);
            this.coordList = Response.json();
            this.filteredCoordList=this.coordList;
        }, (err: any) => {
            this.showLoader = false;
        });
    }
    


    fetchJobsList() {
        this.showLoader = true;
        let body = {
            "uid": this.userId, 
            "isSchedulerList":"true"
        };
        this.schedulerService.getJobsList(body).subscribe((Response: any) => {
            this.showLoader = false;
            this.jobsList = Response.json();
   
        }, (err: any) => {
            this.showLoader = false;
        });
    }
   

    changeSpan(){
        $("#optionSpan1").toggle();
        $("#optionSpan2").toggle();
        if(!$('#optionSpan1').is(':visible'))
            {
                $(".OptionsList").show();
            }
            else{
                $(".OptionsList").hide();
            }
    }
    

    submit(){

        // var cronFreqInput;
        // if($("#cronFreq").val()){
        //     cronFreqInput=$("#cronFreq").val();
        //     console.log($("#cronFreq").val());
        // }else{
        //     cronFreqInput = this.cronValue.cron("value");
        // }
        var moment = require('moment-timezone');
        var start = moment.tz(this.startdate, this.selectedTZone);
        var end = moment.tz(this.enddate, this.selectedTZone);
        console.log(start);
        console.log(end);
        let body={
            "schedularName" :  $("#schedularName").val(),
            "jobIds" : this.selectedFlows,
            "actionExeType" : "parallel",
            "cronFreqInput" : this.cronValue.cron("value"),
            
            "startDate": start.utc().format().slice(0, 16)+start.utc().format().slice(19, 20),
            "endDate": end.utc().format().slice(0, 16)+end.utc().format().slice(19, 20),
            // "startDate": start.utc().format('yyyy-MM-ddTHH:mmZ'),
            // "endDate": end.utc().format(),
            "uid": this.userId,
            "timezone":$("#timezone").val(),
            "timeout":$("#timeout").val(),
            "concurrency":$("#concurrency").val(),
            "execution":$("#execution").val(),
            "throttle":$("#throttle").val(),
        }
        console.log(JSON.stringify(body));
        this.showLoader = true;
        this.schedulerService.submitScheduleOpts(body).subscribe((Response: any) => {
            this.showLoader = false;
           
            if(JSON.parse(Response._body).statusCode==200){
                this.statusMessage="Scheduling Successful";
                $(".alert").addClass("alert-success").show().delay(4000).fadeOut();

            }else{
                this.statusMessage="Failed to Schedule";
                $(".alert").addClass("alert-danger").show().delay(4000).fadeOut();
            }
            // this.clearSelVals(schedularForm);
            this.fetchcoordlist();
        }, (err: any) => {
            this.showLoader = false;
        });
        setTimeout(() => {
            this.clearSelVals();
            // this.clearSelVals(schedularForm);
          }, 2000);
    }

    clearSelVals(){
        $("#schedularName").val("");
        $("#timezone").val("");
        $("#timeout").val("");
        $("#concurrency").val("");
        $("#execution").val("");
        $("#throttle").val("");
        this.startdate="";
        this.enddate="";
        this.selectedFlows=[];
        this.cronValue.cron("value", "* * * * *");
    }

    selectedJob(job){
        this.jobId=job.id;
        if(job.execStatus=="RUNNING"){
            $("#suspendbtn").removeAttr("disabled");
            $("#killbtn").removeAttr("disabled");
            $("#resumebtn").attr("disabled", true);
        }else if(job.execStatus=="SUSPENDED"){
            $("#resumebtn").removeAttr("disabled");
            $("#suspendbtn").attr("disabled", true);
            $("#killbtn").attr("disabled", true);
        }
    }

    oozieOptions(option,e){
        $("#suspendbtn").attr("disabled", true);
        $("#killbtn").attr("disabled", true);
        $("#resumebtn").attr("disabled", true);
        let body={
            "id":this.jobId,"action":option
        }
        // console.log(e);
        // console.log(e.target);
        // console.log(e.target.id);
        // $('[data-toggle="popover"]').popover()
        // $("#"+e.target.id).popover();
        this.showLoader = true;
        this.schedulerService.oozieOptions(body).subscribe((Response: any) => {
            // $("#"+e.target.id).popover();
            this.showLoader = false;
            JSON.parse(Response._body).statusMessage; 
            this.fetchcoordlist();
        }, (err: any) => {
            this.showLoader = false;
        });
    }

    searchJobs() {
        this.filteredCoordList = this.schedulerFilterPipe.transform(this.coordList, this.search);
    }
}