import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Components
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { ComentarioComponent } from './components/comentario/comentario.component';
import { UnidadesComponent } from './components/unidades/unidades.component';
import { PerfilesComponent } from './components/perfiles/perfiles.component';
import { PerfilAdminComponent } from './components/perfil-admin/perfil-admin.component';
import { PerfilEditComponent } from './components/perfil-edit/perfil-edit.component';
import { TiposDocumentsComponent } from './components/tipos-documents/tipos-documents.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    ComentariosComponent,
    ComentarioComponent,
    UnidadesComponent,
    PerfilesComponent,
    PerfilAdminComponent,
    PerfilEditComponent,
    TiposDocumentsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
