import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Componentes
import { startNewProcessComponent } from './startNewProcess.component';
import { revisarSolicitudComponent } from './revisarSolicitud/revisarSolicitud.component';
import { approveDataTaskComponent } from './approveDataTask/approveDataTask.component';
import { enviarObservacionesComponent } from './enviarObservaciones/enviarObservaciones.component';
import { solicitarConceptosComponent } from './solicitarConceptos/solicitarConceptos.component';
import { subirConceptosComponent } from './subir-conceptos/subir-conceptos.component';
import { subirCotizacionComponent } from './subir-cotizacion/subir-cotizacion.component';

@NgModule({
  entryComponents: [
    startNewProcessComponent,
    revisarSolicitudComponent,
    approveDataTaskComponent,
    enviarObservacionesComponent,
    solicitarConceptosComponent,
    subirConceptosComponent,
    subirCotizacionComponent
  ],
  declarations: [
    startNewProcessComponent,
    revisarSolicitudComponent,
    approveDataTaskComponent,
    enviarObservacionesComponent,
    solicitarConceptosComponent,
    subirConceptosComponent,
    subirCotizacionComponent
  ],
  imports: [FormsModule, RouterModule, CommonModule, FontAwesomeModule],
  exports: [
    startNewProcessComponent,
    revisarSolicitudComponent,
    approveDataTaskComponent,
    enviarObservacionesComponent,
    solicitarConceptosComponent,
    subirConceptosComponent,
    subirCotizacionComponent
  ]
})
export class MyAddonModule {}

export { startNewProcessComponent } from './startNewProcess.component';
export { revisarSolicitudComponent } from './revisarSolicitud/revisarSolicitud.component';
export { approveDataTaskComponent } from './approveDataTask/approveDataTask.component';
export { enviarObservacionesComponent } from './enviarObservaciones/enviarObservaciones.component';
export { solicitarConceptosComponent } from './solicitarConceptos/solicitarConceptos.component';
export { subirConceptosComponent } from './subir-conceptos/subir-conceptos.component';
export { subirCotizacionComponent } from './subir-cotizacion/subir-cotizacion.component';
