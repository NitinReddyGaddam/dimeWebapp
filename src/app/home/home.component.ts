import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
    selector: 'section-content',
    templateUrl: './home.component.html',
    styleUrls: ['../../assets/css/banner.css', '../../assets/css/style.css']
})


export class HomeComponent implements OnInit {

    imageSrc = "../../assets/images/image3_small.png";
    imageZoom = "../../assets/images/image3_large.jpg";
    ngOnInit() {
        // $("#zoom_02").elevateZoom({
        //     zoomType: "inner",
        //     cursor: "crosshair",
        //     scrollZoom: "true"
        // });

    }
}
