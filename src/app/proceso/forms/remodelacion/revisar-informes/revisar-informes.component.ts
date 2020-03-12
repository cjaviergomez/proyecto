import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunTaskArchivosComponent } from '../../general/comun-task-archivos.component';
import { Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Solicitud } from '../../../../solicitudes/models/solicitud';

import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'; // Iconos

//Para subir los archivos
import { AngularFireStorage } from '@angular/fire/storage';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';

@Component({
  selector: 'app-revisar-informes',
  templateUrl: './revisar-informes.component.html',
  styleUrls: ['./revisar-informes.component.css']
})
export class revisarInformesComponent extends ComunTaskArchivosComponent implements OnInit, OnDestroy {

  solicitud: Solicitud;
  validos: boolean;
  faTimes = faTimes;
  faCheck = faCheck;

  constructor(route: ActivatedRoute,
              router: Router,
              camundaRestService: CamundaRestService,
              solicitudService: SolicitudService,
              swal: ShowMessagesService,
              usuarioService: UsuarioService,
              authService: AuthService,
              storage: AngularFireStorage) {
    super(route, router, camundaRestService, solicitudService, swal, usuarioService, authService, storage);
  }

  ngOnInit() {
    this.metodoInicial();
    this.getSolicitud();
  }

  getSolicitud(){
    this.solicitudService.getSolicitudProcess(this.procesoId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(solicitud => {
          this.solicitud = solicitud[0];
        });
  }

  //Metodo para completar la tarea.
  completarTarea( valor: boolean){
    this.validos = valor;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Estás seguro que deseas continuar?`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp =>{
      if(resp.value) {
        const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
        this.completeTask(variables);
      }
    });

  }

  //Metodo para general las variables a guardar en camunda.
  generateVariablesFromFormFields() {
    const variables = {
      variables: {
        validos: null
      }
    };
    variables.variables.validos = {
      value: this.validos
    };
    return variables;
  }

  // Metodo para obtener las variables historicas que se van a usar.
  getVariables(variables) {
    this.cargando = false;
   }

   // Metodo para obtener las variables historicas que se van a usar.
  getVariables2(variables) {
    this.getVariables(variables);
   }

  /**
   * Este metodo se ejecuta cuando el componente se destruye
   * Usamos este método para cancelar todos los observables.
   */
  ngOnDestroy(): void {
    // End all subscriptions listening to ngUnsubscribe
    // to avoid memory leaks.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
	}

}
