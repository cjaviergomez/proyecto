import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { ComentarioComponent } from './components/comentario/comentario.component';
import { UnidadesComponent } from './components/unidades/unidades.component';
import { PerfilesComponent } from './components/perfiles/perfiles.component';

// Guards
import { AuthGuard } from 'app/in/guards/auth.guard';

const routes: Routes = [
  {path: 'usuarios', component: UsuariosComponent, canActivate: [ AuthGuard ]},
  {path: 'comentarios', component: ComentariosComponent, canActivate: [AuthGuard]},
  {path: 'comentario/:id', component: ComentarioComponent, canActivate: [AuthGuard]},
  {path: 'unidades', component: UnidadesComponent, canActivate: [AuthGuard]},
  {path: 'perfiles', component: PerfilesComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
