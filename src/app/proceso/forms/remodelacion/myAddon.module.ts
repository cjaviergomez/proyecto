import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { startNewProcessComponent } from './startNewProcess.component';
import { approveDataTaskComponent } from './approveDataTask.component';
import { RouterModule } from '@angular/router';
// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  entryComponents: [startNewProcessComponent,approveDataTaskComponent],
  declarations: [startNewProcessComponent, approveDataTaskComponent],
  imports: [FormsModule, RouterModule, CommonModule, FontAwesomeModule],
  exports: [startNewProcessComponent,approveDataTaskComponent]
})
export class MyAddonModule {}

export { startNewProcessComponent } from './startNewProcess.component';
export { approveDataTaskComponent } from './approveDataTask.component';
