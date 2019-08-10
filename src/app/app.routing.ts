import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { HomeComponent } from './components/home.component';
//import { ErrorComponent } from './components/error.component';
import { SolicitudesListComponent } from './components/solicitudes-list.component';
import { SolicitudAddComponent } from './components/solicitud-add.component';
import { SolicitudAddedComponent } from './components/solicitud-added.component';
import { SolicitudAddErrorComponent } from './components/solicitud-addError.component';
import { SolicitudDetailComponent } from './components/solicitud-detail.component';
import { SolicitudEditComponent } from './components/solicitud-edit.component';
import { EsriMapComponent } from './components/map.component';
import { ReformasListComponent } from './components/reformas-list.component';
import { CallbackComponent } from './components/callback.component';

import {	AuthGuard } from "./services/auth-guard.service";


const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'solicitudes', component: SolicitudesListComponent},
	{path: 'crear-solicitud', component: SolicitudAddComponent },
	{path: 'solicitud-creada', component: SolicitudAddedComponent},
	{path: 'solicitud-error', component: SolicitudAddErrorComponent},
	{path: 'solicitud/:id', component: SolicitudDetailComponent, canActivate: [ AuthGuard ]},
	{path: 'editar-solicitud/:id', component: SolicitudEditComponent, canActivate: [ AuthGuard ]},
	{path: 'map', component: EsriMapComponent},
	//{path: '**', component: ErrorComponent},
	{path: 'reformas', component: ReformasListComponent},
	{path: 'callback', component: CallbackComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
