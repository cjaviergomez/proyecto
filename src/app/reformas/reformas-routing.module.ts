import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ReformasListComponent } from './components/reformas-list/reformas-list.component';
import { AuthGuard } from '../in/guards/auth.guard';

const routes: Routes = [
 {path: 'reformas', component: ReformasListComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReformasRoutingModule { }
