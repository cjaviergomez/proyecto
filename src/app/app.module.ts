import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  //Para trabajar con peticciones http

// Rutas
import { routing, appRoutingProviders } from './app.routing';

// Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';
import { ErrorComponent } from './components/error.component';
import { SolicitudesListComponent } from './components/solicitudes-list.component';
import { SolicitudAddComponent } from './components/solicitud-add.component';
import { SolicitudAddErrorComponent } from './components/solicitud-addError.component';
import { SolicitudAddedComponent } from './components/solicitud-added.component';
import { SolicitudDetailComponent } from './components/solicitud-detail.component';
import { SolicitudEditComponent } from './components/solicitud-edit.component';
import { EsriMapComponent } from './components/map.component';
import { FooterComponent} from './components/footer.component';
import { ReformasListComponent } from './components/reformas-list.component';
import { LoginComponent } from './components/login.component';
import { RegistroComponent } from './components/registro.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    SolicitudesListComponent,
    SolicitudAddComponent,
    SolicitudAddedComponent,
    SolicitudAddErrorComponent,
    SolicitudDetailComponent,
    SolicitudEditComponent,
    EsriMapComponent,
    FooterComponent,
    ReformasListComponent,
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    ReactiveFormsModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
