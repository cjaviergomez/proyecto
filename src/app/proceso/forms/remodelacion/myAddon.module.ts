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
import { recomendarProveedoresComponent } from './recomendar-provedores/recomendar-provedores.component';
import { subirInformeFinancieroComponent } from './subir-informe-financiero/subir-informe-financiero.component';
import { revisionInformeFinancieroComponent } from './revision-informe-financiero/revision-informe-financiero.component';
import { revisarInformesComponent } from './revisar-informes/revisar-informes.component';
import { agregarComentariosComponent } from './agregar-comentarios/agregar-comentarios.component';
import { emitirAvalComponent } from './emitir-aval/emitir-aval.component';

@NgModule({
  entryComponents: [
    startNewProcessComponent,
    revisarSolicitudComponent,
    approveDataTaskComponent,
    enviarObservacionesComponent,
    solicitarConceptosComponent,
    subirConceptosComponent,
    subirCotizacionComponent,
    recomendarProveedoresComponent,
    subirInformeFinancieroComponent,
    revisionInformeFinancieroComponent,
    revisarInformesComponent,
    agregarComentariosComponent,
    emitirAvalComponent
  ],
  declarations: [
    startNewProcessComponent,
    revisarSolicitudComponent,
    approveDataTaskComponent,
    enviarObservacionesComponent,
    solicitarConceptosComponent,
    subirConceptosComponent,
    subirCotizacionComponent,
    recomendarProveedoresComponent,
    subirInformeFinancieroComponent,
    revisionInformeFinancieroComponent,
    revisarInformesComponent,
    agregarComentariosComponent,
    emitirAvalComponent
  ],
  imports: [FormsModule, RouterModule, CommonModule, FontAwesomeModule],
  exports: [
    startNewProcessComponent,
    revisarSolicitudComponent,
    approveDataTaskComponent,
    enviarObservacionesComponent,
    solicitarConceptosComponent,
    subirConceptosComponent,
    subirCotizacionComponent,
    recomendarProveedoresComponent,
    subirInformeFinancieroComponent,
    revisionInformeFinancieroComponent,
    revisarInformesComponent,
    agregarComentariosComponent,
    emitirAvalComponent
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
export { recomendarProveedoresComponent } from './recomendar-provedores/recomendar-provedores.component';
export { subirInformeFinancieroComponent } from './subir-informe-financiero/subir-informe-financiero.component';
export { revisionInformeFinancieroComponent } from './revision-informe-financiero/revision-informe-financiero.component';
export { revisarInformesComponent } from './revisar-informes/revisar-informes.component';
export { agregarComentariosComponent } from './agregar-comentarios/agregar-comentarios.component';
export { emitirAvalComponent } from './emitir-aval/emitir-aval.component';
