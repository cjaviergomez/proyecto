import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  //Para trabajar con peticciones http

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//Para trabajar con Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

// Rutas
import { routing, appRoutingProviders } from './app.routing';

// Spinner
import { NgxSpinnerModule } from 'ngx-spinner';

// Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { SolicitudesListComponent } from './components/solicitudes-list/solicitudes-list.component';
import { SolicitudAddComponent } from './components/solicitud-add/solicitud-add.component';
import { SolicitudAddErrorComponent } from './components/solicitud-addError/solicitud-addError.component';
import { SolicitudAddedComponent } from './components/solicitud-added/solicitud-added.component';
import { SolicitudDetailComponent } from './components/solicitud-detail/solicitud-detail.component';
import { SolicitudEditComponent } from './components/solicitud-edit/solicitud-edit.component';
import { EsriMapComponent } from './components/map/map.component';
import { FooterComponent} from './components/footer/footer.component';
import { ReformasListComponent } from './components/reformas-list/reformas-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ConfigComponent } from './components/config/config.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { ProcesoComponent } from './components/proceso/proceso.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { InfoAdminComponent } from './components/info-admin/info-admin.component';

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
    RegistroComponent,
    UsuariosComponent,
    PerfilComponent,
    ConfigComponent,
    UserManagerComponent,
    ResetPassComponent,
    ProcesoComponent,
    PreguntasFrecuentesComponent,
    ContactoComponent,
    InfoAdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    routing,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireDatabaseModule,
    NgxSpinnerModule // Spinner
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
