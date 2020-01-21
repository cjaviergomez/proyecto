import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OutRoutingModule } from './out-routing.module';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { ProcesoComponent } from './components/proceso/proceso.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { ContactoComponent } from './components/contacto/contacto.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    UserManagerComponent,
    ResetPassComponent,
    ProcesoComponent,
    PreguntasFrecuentesComponent,
    ContactoComponent
  ],
  imports: [
    CommonModule,
    OutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class OutModule { }
