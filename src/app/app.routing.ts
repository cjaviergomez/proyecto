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
import { ProcesoComponent } from './components/proceso/proceso.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { InfoAdminComponent } from './components/info-admin/info-admin.component';
import { ProcesslistComponent } from './components/processlist/processlist.component';
import { StartProcessComponent } from './components/start-process/start-process.component';
import { TasklistComponent } from './components/tasklist/tasklist.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { VerificadorGuard } from './guards/verificador.guard';
import { AgregadorGuard } from './guards/agregador.guard';

const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'solicitudes', component: SolicitudesListComponent, canActivate: [ AuthGuard ]},
	{path: 'crear-solicitud', component: SolicitudAddComponent },
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
  {path: 'proceso', component: ProcesoComponent},
  {path: 'questions', component: PreguntasFrecuentesComponent},
  {path: 'contacto', component: ContactoComponent},
  {path: 'processlist', component: ProcesslistComponent, canActivate: [ AuthGuard ] },
  {path: 'infoAdmin', component: InfoAdminComponent, canActivate: [AuthGuard]},
  {path: 'startprocess/:processdefinitionkey', component: StartProcessComponent, canActivate: [AuthGuard] },
  {path: 'tasklist', component: TasklistComponent },
  {path: 'tasklist/:id', component: TasklistComponent },
	{path: '**', component: ErrorComponent}  //IMPORTANTE: Esta ruta debe ser la última que se declare, si se declara una ruta despues de esta, siempre va a tomar esta.
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
