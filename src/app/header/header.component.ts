import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthService } from '../route-auth';
import { HeaderService } from './header.service';
import { CommonService } from '../services/common.service';
declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['../../assets/css/header.css'],
    providers: [HeaderService]
})
export class HeaderComponent implements OnInit {
    @Output() voted = new EventEmitter<boolean>();

    userName;
    userId;
    constructor(private headerService: HeaderService, private route: Router, private appComp: AppComponent, private authService: AuthService, private commonServices: CommonService) { }
    classIng = "test";
    classViz = "test";

    ngOnInit() {
        this.userName = localStorage.getItem('UserName');
        this.userName = this.userName.charAt(0).toUpperCase() + this.userName.substring(1);
        this.userId = localStorage.getItem('uId');
        if (window.location.href.includes("data-ingestion")) {
            $("header nav ul li").removeClass("active");
            $("header nav ul li:eq(1)").addClass("active");
        }
        else if (window.location.href.includes("home")) {
            $("header nav ul li").removeClass("active");
            $("header nav ul li:eq(0)").addClass("active");
        }
        else if (window.location.href.includes("adas-visualization")) {
            $("header nav ul li").removeClass("active");
            $("header nav ul li:eq(5)").addClass("active");
        }
        else if (window.location.href.includes("visualization")) {
            $("header nav ul li").removeClass("active");
            $("header nav ul li:eq(3)").addClass("active");
        }
        else if (window.location.href.includes("data-access")) {
            $("header nav ul li").removeClass("active");
            $("header nav ul li:eq(4)").addClass("active");
        }
        else if (window.location.href.includes("transform")) {
            $("header nav ul li").removeClass("active");
            $("header nav ul li:eq(2)").addClass("active");
        }
        else if (window.location.href.includes("manufacturing")) {
            $("header nav ul li").removeClass("active");
            $("header nav ul li:eq(5)").addClass("active");
        }
        else if (window.location.href.includes("ice-visualization")) {
            $("header nav ul li").removeClass("active");
            $("header nav ul li:eq(5)").addClass("active");
        }

        this.iceValidations();
        this.commonServices.triggerIceValidations.subscribe(
            (d) => {
                console.log("ICE Validations triggered");
                this.iceValidations();
            }
        )
    }


    vote(agreed: boolean) {
        this.voted.emit(agreed);
    }

    changeHeader(id: string, e: any) {
        console.log("changing header to:", id);
        $(e.target).parents("ul").find("li").removeClass("active");
        $(e.target).parent("li").addClass("active");
    }

    changeMfgHeader(id: string, e: any) {
        console.log("changing header to:", id);
        $(e.target).parents("ul").find("li").removeClass("active");
        $("#mfgSolList").addClass("active");
    }

    func() {
        console.log("fun clicked");
        this.commonServices.abc.emit("click");
    }

    logout() {
        this.appComp.headerVisible = this.authService.isLoggedIn;
        this.authService.logout();
        this.route.navigateByUrl('');
        sessionStorage.clear();
        localStorage.clear();
    }
    trial(input) {
        this.route.navigate(['/manufacturing'], { queryParams: { description: input } });
    }

    ingestionRoute() {
        this.route.navigate(['/data-ingestion'], { queryParams: { description: "ipc" } });

    }

    ewsIngestionPage() {
        this.route.navigate(['/data-ingestion'], { queryParams: { description: "ews" } });

    }

    ingestionPage() {
        this.route.navigate(['/data-ingestion']);
    }
    moveADADvisualization() {
        this.route.navigate(['/adas-visualization2']);

    }
    ewsAggViz() {
        this.route.navigate(['/ews-agg-viz']);

    }
    ewsVehViz() {
        this.route.navigate(['/ews-veh-viz']);
    }


    showIce() {
        this.commonServices.setICE.next(true);
        console.log("inside show ice");
    }

    showADAS() {
        this.route.navigate(['/manufacturing']);
        this.commonServices.setADAS.next(true);
    }


    iceValidations() {
        this.headerService.iceExistanceForUser(this.userId).subscribe((Response: any) => {
            console.log(Response);
            let op = Response._body;
            console.log(op);
            if (op.match("ipc is already created")) {
                this.classIng = "disabled";
            } else {
                this.classIng = "test";
            }
        });
        this.headerService.iceVizExistanceForUser(this.userId).subscribe((Response: any) => {
            console.log(Response);

            let op = JSON.parse(Response._body);
            console.log(op);
            let count = 0;
            for (let i = 0; i < op.length; i++) {

                if (op[i].Message.match("Table exists and Data is present")) {
                    count = count + 1;
                    console.log(count);
                }
            }
            if (count >0) {
                this.classViz = "test";
            } else {
                this.classViz = "disabled";
            }
        });
    }
}
