import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { ErrorComponent } from './out/components/error/error.component';

const appRoutes: Routes = [
  {path: '', redirectTo: 'modOut',  pathMatch: 'full'},
  {path: 'modOut', loadChildren: ()=> import('./out/out.module').then(m => m.OutModule)},
  {path: 'modSolicitudes', loadChildren: ()=> import('./solicitudes/solicitudes.module').then(m => m.SolicitudesModule)},
	{path: 'modReformas', loadChildren: ()=>import('./reformas/reformas.module').then(m => m.ReformasModule)},
  {path: 'modIn', loadChildren: ()=> import('./in/in.module').then(m => m.InModule)},
  {path: 'modAdmin', loadChildren: ()=> import('./admin/admin.module').then(m => m.AdminModule)},
  {path: 'modProceso', loadChildren: () => import('./proceso/proceso.module').then(m => m.ProcesoModule)},
	{path: '**', component: ErrorComponent}  //IMPORTANTE: Esta ruta debe ser la última que se declare, si se declara una ruta despues de esta, siempre va a tomar esta.
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
