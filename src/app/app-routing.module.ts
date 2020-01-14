import { Routes, RouterModule } from '@angular/router';
import { DataIngestionComponent } from './data-ingestion/data-ingestion.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
//import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { DataAccessComponent } from './data-access/data-access.component';
import { TransformComponent } from './transform/transform.component';
import { CodeRepositoryComponent } from './code-repo/code-repo.component';
import { ICEComponent } from './manufacturing/ice.component';
import { IceVisualizationComponent } from './ice-visualization/ice-visualization.component';
import { EWSAggVizComponent } from './ews-agg-viz/ews-agg-viz.component';
import { EWSVehVizComponent } from './ews-veh-viz/ews-veh-viz.component';
import { AdasVisualizationComponent } from './adas-visualization/adas-visualization.component';
import { AdasVisualizationComponent2 } from './adas-visualization2/adas-visualization2.component';
import { ActivateRouteGuard } from './route-guard';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  // {
  //   path: 'admin',
  //   component: AdminComponent,
  //   canActivate: [ActivateRouteGuard]
  // },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'data-ingestion',
    component: DataIngestionComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'scheduler',
    component: SchedulerComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'visualization',
    component: VisualizationComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'data-access',
    component: DataAccessComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'transform',
    component: TransformComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'code-repo',
    component: CodeRepositoryComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'manufacturing',
    component: ICEComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'ice-visualization',
    component: IceVisualizationComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'adas-visualization',
    component: AdasVisualizationComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'adas-visualization2',
    component: AdasVisualizationComponent2,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'ews-agg-viz',
    component: EWSAggVizComponent,
    canActivate: [ActivateRouteGuard]
  },
  {
    path: 'ews-veh-viz',
    component: EWSVehVizComponent,
    canActivate: [ActivateRouteGuard]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }