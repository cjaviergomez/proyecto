import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcesoRoutingModule } from './proceso-routing.module';
// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//Components
import { ProcesslistComponent } from './components/processlist/processlist.component';
import { GenericForm } from './generic-form.component';
import { StartProcessComponent } from './components/start-process/start-process.component';
import { TasklistComponent } from './components/tasklist/tasklist.component';
import { MyAddonModule } from './forms/remodelacion/myAddon.module';

@NgModule({
  declarations: [
    ProcesslistComponent,
    GenericForm,
    StartProcessComponent,
    TasklistComponent
  ],
  imports: [
    CommonModule,
    ProcesoRoutingModule,
    FontAwesomeModule,
    MyAddonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[DatePipe]
})
export class ProcesoModule { }
