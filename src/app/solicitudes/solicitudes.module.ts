import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SolicitudesRoutingModule } from './solicitudes-routing.module';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Compponentes
import { SolicitudesListComponent } from './components/solicitudes-list/solicitudes-list.component';
import { SolicitudAddErrorComponent } from './components/solicitud-addError/solicitud-addError.component';
import { SolicitudAddedComponent } from './components/solicitud-added/solicitud-added.component';
import { SolicitudDetailComponent } from './components/solicitud-detail/solicitud-detail.component';

// Services
import { SolicitudService } from './services/solicitud.service';

@NgModule({
  declarations: [
    SolicitudesListComponent,
    SolicitudAddedComponent,
    SolicitudAddErrorComponent,
    SolicitudDetailComponent
  ],
  imports: [
    CommonModule,
    SolicitudesRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SolicitudService]
})
export class SolicitudesModule { }
