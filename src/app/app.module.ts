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
import { ErrorComponent } from './out/components/error/error.component';
import { FooterComponent} from './out/components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    FooterComponent
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
