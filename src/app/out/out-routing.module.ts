import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { ProcesoComponent } from './components/proceso/proceso.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { ContactoComponent } from './components/contacto/contacto.component';

const routes: Routes = [
  {path: '', redirectTo: 'home',  pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
	{path: 'registro', component: RegistroComponent},
  {path: 'userMg', component: UserManagerComponent},
  {path: 'resetPass', component: ResetPassComponent},
  {path: 'questions', component: PreguntasFrecuentesComponent},
  {path: 'contacto', component: ContactoComponent},
  {path: 'proceso', component: ProcesoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutRoutingModule { }
