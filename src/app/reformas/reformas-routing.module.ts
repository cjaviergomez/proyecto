import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { AuthGuard } from '../in/guards/auth.guard';

// Components
import { ReformasListComponent } from './components/reformas-list/reformas-list.component';
import { ReformaDetailComponent } from './components/reforma-detail/reforma-detail.component';

const routes: Routes = [
	{ path: 'reformas', component: ReformasListComponent, canActivate: [AuthGuard] },
	{
		path: 'reformas/:nombreEdificio/:subCapa/:objectoId/:piso',
		component: ReformasListComponent,
		canActivate: [AuthGuard]
	},
	{ path: 'reforma/:id', component: ReformaDetailComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReformasRoutingModule {}
