import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { ComentarioComponent } from './components/comentario/comentario.component';
import { UnidadesComponent } from './components/unidades/unidades.component';
import { PerfilesComponent } from './components/perfiles/perfiles.component';
import { PerfilAdminComponent } from './components/perfil-admin/perfil-admin.component';
import { PerfilEditComponent } from './components/perfil-edit/perfil-edit.component';

// Guards
import { AgregadorGuard } from './guards/agregador.guard';
import { VerificadorGuard } from './guards/verificador.guard';
import { SolucionadorGuard } from './guards/solucionador.guard';

const routes: Routes = [
  {path: 'usuarios', component: UsuariosComponent, canActivate: [ VerificadorGuard ]},
  {path: 'comentarios', component: ComentariosComponent, canActivate: [SolucionadorGuard]},
  {path: 'comentario/:id', component: ComentarioComponent, canActivate: [SolucionadorGuard]},
  {path: 'unidades', component: UnidadesComponent, canActivate: [AgregadorGuard]},
  {path: 'perfiles', component: PerfilesComponent, canActivate: [AgregadorGuard]},
  {path: 'perfilAdmin/:id', component: PerfilAdminComponent, canActivate: [AgregadorGuard]},
  {path: 'perfilEdit/:id', component: PerfilEditComponent, canActivate: [VerificadorGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
