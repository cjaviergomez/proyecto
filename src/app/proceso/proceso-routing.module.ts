import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Component
import { ProcesslistComponent } from './components/processlist/processlist.component';
import { StartProcessComponent } from './components/start-process/start-process.component';
import { TasklistComponent } from './components/tasklist/tasklist.component';

//Guards
import { AuthGuard } from 'app/in/guards/auth.guard';
import { CreadorGuard } from './guards/creador.guard';


const routes: Routes = [
  {path: 'processlist/:idCapa/:edif/:subCapa/:elem/:piso', component: ProcesslistComponent, canActivate: [ CreadorGuard ] },
  {path: 'startprocess/:processdefinitionkey/:idCapa/:edif/:subCapa/:elem/:piso', component: StartProcessComponent, canActivate: [AuthGuard] },
  {path: 'tasklist/:id', component: TasklistComponent },
  {path: 'tasklist/:id/:taskId', component: TasklistComponent },
  {path: 'tasklist/:id/:taskId/:formKey', component: TasklistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesoRoutingModule { }
