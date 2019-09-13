import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { HomeComponent } from './components/home.component';
import { ErrorComponent } from './components/error.component';
import { SolicitudesListComponent } from './components/solicitudes-list.component';
import { SolicitudAddComponent } from './components/solicitud-add.component';
import { SolicitudAddedComponent } from './components/solicitud-added.component';
import { SolicitudAddErrorComponent } from './components/solicitud-addError.component';
import { SolicitudDetailComponent } from './components/solicitud-detail.component';
import { SolicitudEditComponent } from './components/solicitud-edit.component';
import { EsriMapComponent } from './components/map.component';
import { ReformasListComponent } from './components/reformas-list.component';
import { LoginComponent } from './components/login.component';
import { RegistroComponent } from './components/registro.component';

import { AuthGuard } from './guards/auth.guard';


const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'solicitudes', component: SolicitudesListComponent},
	{path: 'crear-solicitud', component: SolicitudAddComponent },
	{path: 'solicitud-creada', component: SolicitudAddedComponent},
	{path: 'solicitud-error', component: SolicitudAddErrorComponent},
	{path: 'solicitud/:id', component: SolicitudDetailComponent },
	{path: 'editar-solicitud/:id', component: SolicitudEditComponent },
	{path: 'map', component: EsriMapComponent, canActivate: [ AuthGuard ] },
	{path: 'reformas', component: ReformasListComponent},
	{path: 'login', component: LoginComponent},
	{path: 'registro', component: RegistroComponent},
	{path: '**', component: ErrorComponent}  //IMPORTANTE: Esta ruta debe ser la ultima que se declare, si se declara una ruta despues de esta, siempre va a tomar esta.
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
