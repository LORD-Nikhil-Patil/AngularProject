import { Routes } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
    {path: '',  component: LandingComponent},
    { path: 'chart', component: ChartComponent }
];
