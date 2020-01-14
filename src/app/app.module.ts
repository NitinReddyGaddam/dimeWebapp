import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DataIngestionComponent } from './data-ingestion/data-ingestion.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { DataAccessComponent } from './data-access/data-access.component';
import { TransformComponent } from './transform/transform.component';
import { CodeRepositoryComponent } from './code-repo/code-repo.component';
import { ICEComponent } from './manufacturing/ice.component';
import { IceVisualizationComponent } from './ice-visualization/ice-visualization.component';
import { EWSAggVizComponent } from './ews-agg-viz/ews-agg-viz.component';
import { EWSVehVizComponent } from './ews-veh-viz/ews-veh-viz.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { RouterModule } from '../../node_modules/@angular/router';
// import routes from './app.routes';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NvD3Module } from 'ng2-nvd3';
import { Http, Response, RequestOptions, Headers, HttpModule } from '@angular/http';
import * as $ from 'jquery';
import { AuthService } from './route-auth';
import { ActivateRouteGuard } from './route-guard';
import { AdasVisualizationComponent } from './adas-visualization/adas-visualization.component';
import { AdasVisualizationComponent2 } from './adas-visualization2/adas-visualization2.component';
import { NouisliderModule } from 'ng2-nouislider';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Select2Module } from 'ng2-select2';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
// import { AdminComponent } from './admin/admin.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DataIngestionComponent,
    HeaderComponent,
    FooterComponent,
    VisualizationComponent,
    DataAccessComponent,
    TransformComponent,
    CodeRepositoryComponent,
    ICEComponent,
    IceVisualizationComponent,
    EWSAggVizComponent,
    EWSVehVizComponent,
    AdasVisualizationComponent,
    SchedulerComponent,
    AdasVisualizationComponent2,
    // AdminComponent
  ],
  exports: [
    NouisliderModule,
    RouterModule
  ],

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    HttpClientModule,
    HttpModule,
    NvD3Module,
    Select2Module,
    NgSelectModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
       apiKey:'AIzaSyBLHyp1gKH-YdX3GNHcDaiiPmN_fWR7UEw'
       
    }),
    
  ],
  providers: [DatePipe, AuthService, ActivateRouteGuard, AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
