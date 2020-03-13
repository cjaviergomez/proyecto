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
import { elegirInterventorComponent } from './elegir-interventor/elegir-interventor.component';
import { procesoContratacionComponent } from './proceso-contratacion/proceso-contratacion.component';
import { confirmarMaterialesComponent } from './confirmar-materiales/confirmar-materiales.component';
import { documentosInicioObraComponent } from './documentos-inicio-obra/documentos-inicio-obra.component';
import { verificarDocumentosComponent } from './verificar-documentos/verificar-documentos.component';
import { iniciarObraComponent } from './iniciar-obra/iniciar-obra.component';
import { realizarMinutaComponent } from './realizar-minuta/realizar-minuta.component';
import { seguimientoObraComponent } from './seguimiento-obra/seguimiento-obra.component';
import { subirInformeSupervisionComponent } from './subir-informe-supervision/subir-informe-supervision.component';
import { actaFinalizacionObraComponent } from './acta-finalizacion-obra/acta-finalizacion-obra.component';
import { verificarCumplimientoComponent } from './verificar-cumplimiento/verificar-cumplimiento.component';
import { finalizarObraComponent } from './finalizar-obra/finalizar-obra.component';

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
    emitirAvalComponent,
    elegirInterventorComponent,
    procesoContratacionComponent,
    confirmarMaterialesComponent,
    documentosInicioObraComponent,
    verificarDocumentosComponent,
    iniciarObraComponent,
    realizarMinutaComponent,
    seguimientoObraComponent,
    subirInformeSupervisionComponent,
    actaFinalizacionObraComponent,
    verificarCumplimientoComponent,
    finalizarObraComponent
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
    emitirAvalComponent,
    elegirInterventorComponent,
    procesoContratacionComponent,
    confirmarMaterialesComponent,
    documentosInicioObraComponent,
    verificarDocumentosComponent,
    iniciarObraComponent,
    realizarMinutaComponent,
    seguimientoObraComponent,
    subirInformeSupervisionComponent,
    actaFinalizacionObraComponent,
    verificarCumplimientoComponent,
    finalizarObraComponent
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
    emitirAvalComponent,
    elegirInterventorComponent,
    procesoContratacionComponent,
    confirmarMaterialesComponent,
    documentosInicioObraComponent,
    verificarDocumentosComponent,
    iniciarObraComponent,
    realizarMinutaComponent,
    seguimientoObraComponent,
    subirInformeSupervisionComponent,
    actaFinalizacionObraComponent,
    verificarCumplimientoComponent,
    finalizarObraComponent
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
export { elegirInterventorComponent } from './elegir-interventor/elegir-interventor.component';
export { procesoContratacionComponent } from './proceso-contratacion/proceso-contratacion.component';
export { confirmarMaterialesComponent } from './confirmar-materiales/confirmar-materiales.component';
export { documentosInicioObraComponent } from './documentos-inicio-obra/documentos-inicio-obra.component';
export { verificarDocumentosComponent } from './verificar-documentos/verificar-documentos.component';
export { iniciarObraComponent } from './iniciar-obra/iniciar-obra.component';
export { realizarMinutaComponent } from './realizar-minuta/realizar-minuta.component';
export { seguimientoObraComponent } from './seguimiento-obra/seguimiento-obra.component';
export { subirInformeSupervisionComponent } from './subir-informe-supervision/subir-informe-supervision.component';
export { actaFinalizacionObraComponent } from './acta-finalizacion-obra/acta-finalizacion-obra.component';
export { verificarCumplimientoComponent } from './verificar-cumplimiento/verificar-cumplimiento.component';
export { finalizarObraComponent } from './finalizar-obra/finalizar-obra.component';
