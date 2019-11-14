import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { SolicitudesListComponent } from './components/solicitudes-list/solicitudes-list.component';
import { SolicitudAddComponent } from './components/solicitud-add/solicitud-add.component';
import { SolicitudAddedComponent } from './components/solicitud-added/solicitud-added.component';
import { SolicitudAddErrorComponent } from './components/solicitud-addError/solicitud-addError.component';
import { SolicitudDetailComponent } from './components/solicitud-detail/solicitud-detail.component';
import { SolicitudEditComponent } from './components/solicitud-edit/solicitud-edit.component';
import { EsriMapComponent } from './components/map/map.component';
import { ReformasListComponent } from './components/reformas-list/reformas-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ConfigComponent } from './components/config/config.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'solicitudes', component: SolicitudesListComponent, canActivate: [ AuthGuard ]},
	{path: 'crear-solicitud', component: SolicitudAddComponent, canActivate: [ AuthGuard ] },
	{path: 'solicitud-creada', component: SolicitudAddedComponent, canActivate: [ AuthGuard ]},
	{path: 'solicitud-error', component: SolicitudAddErrorComponent, canActivate: [ AuthGuard ]},
	{path: 'solicitud/:id', component: SolicitudDetailComponent },
	{path: 'editar-solicitud/:id', component: SolicitudEditComponent, canActivate: [ AuthGuard ] },
	{path: 'map', component: EsriMapComponent, canActivate: [ AuthGuard ] },
	{path: 'reformas', component: ReformasListComponent, canActivate: [ AuthGuard ]},
	{path: 'login', component: LoginComponent},
	{path: 'registro', component: RegistroComponent},
	{path: 'usuarios', component: UsuariosComponent, canActivate: [ AuthGuard ]},
  {path: 'perfil/:id', component: PerfilComponent, canActivate: [ AuthGuard ]},
  {path: 'config', component: ConfigComponent, canActivate: [AuthGuard]},
  {path: 'userMg', component: UserManagerComponent},
  {path: 'resetPass', component: ResetPassComponent},
	{path: '**', component: ErrorComponent}  //IMPORTANTE: Esta ruta debe ser la última que se declare, si se declara una ruta despues de esta, siempre va a tomar esta.
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
