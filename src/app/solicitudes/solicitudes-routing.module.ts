import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Compponentes
import { SolicitudesListComponent } from './components/solicitudes-list/solicitudes-list.component';
import { SolicitudAddErrorComponent } from './components/solicitud-addError/solicitud-addError.component';
import { SolicitudAddedComponent } from './components/solicitud-added/solicitud-added.component';
import { SolicitudDetailComponent } from './components/solicitud-detail/solicitud-detail.component';

// Guards
import { AuthGuard } from '../in/guards/auth.guard';

const routes: Routes = [
	{ path: 'solicitudes', component: SolicitudesListComponent, canActivate: [AuthGuard] },
	{
		path: 'solicitudes/:idCapa/:idSubCapa/:subCapa/:objectoId/:piso',
		component: SolicitudesListComponent,
		canActivate: [AuthGuard]
	},
	{ path: 'solicitud-creada', component: SolicitudAddedComponent, canActivate: [AuthGuard] },
	{ path: 'solicitud-error', component: SolicitudAddErrorComponent, canActivate: [AuthGuard] },
	{ path: 'solicitud/:id', component: SolicitudDetailComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SolicitudesRoutingModule {}
