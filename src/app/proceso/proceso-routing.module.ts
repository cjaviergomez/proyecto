import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Component
import { ProcesslistComponent } from './components/processlist/processlist.component';
import { StartProcessComponent } from './components/start-process/start-process.component';
import { TasklistComponent } from './components/tasklist/tasklist.component';

//Guards
import { AuthGuard } from 'app/in/guards/auth.guard';


const routes: Routes = [
  {path: 'processlist', component: ProcesslistComponent, canActivate: [ AuthGuard ] },
  {path: 'startprocess/:processdefinitionkey', component: StartProcessComponent, canActivate: [AuthGuard] },
  {path: 'tasklist', component: TasklistComponent },
  {path: 'tasklist/:id', component: TasklistComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesoRoutingModule { }
