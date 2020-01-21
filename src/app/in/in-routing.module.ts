import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { EsriMapComponent } from './components/map/map.component';
import { ConfigComponent } from './components/config/config.component';
import { PerfilComponent } from './components/perfil/perfil.component';

// Guards
import { AuthGuard } from 'app/in/guards/auth.guard';

const routes: Routes = [
  {path: 'map', component: EsriMapComponent, canActivate: [ AuthGuard ] },
  {path: 'config', component: ConfigComponent, canActivate: [AuthGuard]},
  {path: 'perfil/:id', component: PerfilComponent, canActivate: [ AuthGuard ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InRoutingModule { }
