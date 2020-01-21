import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SolicitudesRoutingModule } from './solicitudes-routing.module';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Compponentes
import { SolicitudesListComponent } from './components/solicitudes-list/solicitudes-list.component';
import { SolicitudAddComponent } from './components/solicitud-add/solicitud-add.component';
import { SolicitudAddErrorComponent } from './components/solicitud-addError/solicitud-addError.component';
import { SolicitudAddedComponent } from './components/solicitud-added/solicitud-added.component';
import { SolicitudDetailComponent } from './components/solicitud-detail/solicitud-detail.component';
import { SolicitudEditComponent } from './components/solicitud-edit/solicitud-edit.component';

// Services
import { SolicitudService } from './services/solicitud.service';

@NgModule({
  declarations: [
    SolicitudesListComponent,
    SolicitudAddComponent,
    SolicitudAddedComponent,
    SolicitudAddErrorComponent,
    SolicitudDetailComponent,
    SolicitudEditComponent
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
