import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InRoutingModule } from './in-routing.module';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//Components
import { EsriMapComponent } from './components/map/map.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ConfigComponent } from './components/config/config.component';


@NgModule({
  declarations: [
    EsriMapComponent,
    PerfilComponent,
    ConfigComponent
  ],
  imports: [
    CommonModule,
    InRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InModule { }
