import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { Alert } from 'selenium-webdriver';
declare var $: any;

@Component({
    selector: 'section-content',
    templateUrl: './ice.component.html',
    styleUrls: ['../../assets/css/data-access.css', '../../assets/css/code_repository.css', '../../assets/css/ice.css']
})
export class ICEComponent implements OnInit {
    headings: string;
    imageSrc;
    constructor(private commonServices: CommonService, private activatedRoute: ActivatedRoute) { }
    path;
    headerOption;
    image;

    ngOnInit() {
        $("#Architecture_Diagram_mBIDS").hide();
        $("#IPCandHelp").hide();
        this.image = "";

        this.activatedRoute.queryParams
            .subscribe(params => {
                let headerOption = params['description'];
                console.log("query params" + params.description);
                console.log("query params" + headerOption);
                if (headerOption == 'Help' || headerOption == 'ADASHelp') {
                    console.log("first here");
                    this.ChangeImage(headerOption);
                }
                else {
                    console.log("second here");
                    this.pathChanged(headerOption);
                }
            });

    }

    ChangeImage(headerOption) {
        $("#Architecture_Diagram_mBIDS").hide();
        $("#IPCandHelp").show();
        let imagelement = document.getElementById("IPCandHelp").getElementsByTagName('img')[0];
        if (headerOption == 'Help') {
            this.headings = "Indirect Part Classification";
            this.image = "../../assets/images/ICEFlow.png";
            imagelement.classList.remove('Architecture_Diagram');
            imagelement.classList.remove('adasHelp');
            imagelement.classList.add('ICE_Diagram');
        }
        else if (headerOption == 'ADASHelp') {
            this.headings = "ADAS_FLow";
            this.image = "../../assets/images/ADAS_FCA_FLow.jpg";
            imagelement.classList.remove('Architecture_Diagram');
            imagelement.classList.remove('ICE_Diagram');
            imagelement.classList.add('adasHelp');
        }
    }
    pathChanged(currentPath) {
        console.log("current " + currentPath);
        this.imageSrc = currentPath;
        $("#IPCandHelp").hide();
        $("#Architecture_Diagram_mBIDS").show();
        if (currentPath == "../../assets/images/Supply_Chain_Management.jpg") {
            this.headings = "Supply Chain Management";
        }
        else if (currentPath == "../../assets/images/FinancialManagement.jpg") {
            this.headings = "Financial Management";
        }
        else if (currentPath == "../../assets/images/Customer_Management.jpg") {
            this.headings = "Customer Management";
        }
    }
    openPopup() {
        $("#myModal").modal("show");
    }

    closeMyModal() {
        $("#myModal").modal("hide");
    }

}








