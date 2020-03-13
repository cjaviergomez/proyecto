import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunTaskComponent } from '../../general/comun-task.component';
import Swal from 'sweetalert2';
import { faCog } from '@fortawesome/free-solid-svg-icons'; // Iconos

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';

@Component({
  selector: 'app-proceso-contratacion',
  templateUrl: './proceso-contratacion.component.html',
  styleUrls: ['./proceso-contratacion.component.css']
})
export class procesoContratacionComponent extends ComunTaskComponent implements OnInit, OnDestroy {

  faCog = faCog;

  constructor(route: ActivatedRoute,
              router: Router,
              camundaRestService: CamundaRestService,
              solicitudService: SolicitudService,
              swal: ShowMessagesService,
              usuarioService: UsuarioService,
              authService: AuthService) {
    super(route, router, camundaRestService, solicitudService, swal, usuarioService, authService);
  }

  ngOnInit() {
    this.metodoInicial();
  }

  //Metodo para completar la tarea.
  completarTarea(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea continuar?`,
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
      }
    };
    return variables;
  }

  getVariables(variables){
    this.cargando = false;
  }

  // Metodo para obtener las variables historicas que se van a usar.
  getVariables2(variables) {
    this.cargando = false;
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
