import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';
// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { startNewProcessComponent } from './startNewProcess.component';
import { revisarSolicitudComponent } from './revisarSolicitud/revisarSolicitud.component';
import { approveDataTaskComponent } from './approveDataTask/approveDataTask.component';

@NgModule({
  entryComponents: [startNewProcessComponent, revisarSolicitudComponent, approveDataTaskComponent],
  declarations: [startNewProcessComponent, revisarSolicitudComponent, approveDataTaskComponent],
  imports: [FormsModule, RouterModule, CommonModule, FontAwesomeModule],
  exports: [startNewProcessComponent, revisarSolicitudComponent, approveDataTaskComponent]
})
export class MyAddonModule {}

export { startNewProcessComponent } from './startNewProcess.component';
export { revisarSolicitudComponent } from './revisarSolicitud/revisarSolicitud.component';
export { approveDataTaskComponent } from './approveDataTask/approveDataTask.component';
