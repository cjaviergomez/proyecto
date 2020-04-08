import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ComunTaskComponent } from '../../general/comun-task.component';
import Swal from 'sweetalert2';

// Modelos
import { Usuario } from '../../../../admin/models/usuario';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';
import { Notificacion } from 'app/in/models/notificacion';

@Component({
  selector: 'app-elegir-interventor',
  templateUrl: './elegir-interventor.component.html',
  styleUrls: ['./elegir-interventor.component.css']
})
export class elegirInterventorComponent extends ComunTaskComponent implements OnInit, OnDestroy {

  nombresInterventor: Usuario[] = [];
  interventorId: string = null;

  constructor(route: ActivatedRoute,
              router: Router,
              camundaRestService: CamundaRestService,
              solicitudService: SolicitudService,
              swal: ShowMessagesService,
              usuarioService: UsuarioService,
              authService: AuthService,
              notificacionService: NotificacionService) {
                super(route, router, camundaRestService, solicitudService, swal, usuarioService, authService, notificacionService);
              }

  ngOnInit() {
    this.metodoInicial();
    this.getUsuarios();
  }

  //Metodo para obtener los usuario con los distintos perfiles de la base de datos.
  getUsuarios(){
    this.usuarioService.getUsuariosInterventor()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(usuariosP => {
          this.nombresInterventor = usuariosP;
    });
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
        this.enviarNotificaciones();
        this.completeTask(variables);
      }
    });
  }

  /**
   * Metodo para enviar las respectivas notificaciones a cada uno de los actores del proceso
   * segùn la tarea.
   */
  enviarNotificaciones() {
    //Notificar el avance en el proceso y la asignaci+on de las uaas asesoras.
    let notificacionAsignacion: Notificacion;
    let notificacionAvance: Notificacion;
    let notificacionOficina: Notificacion;
    const id = Math.random().toString(36).substring(2);
    const id2 = Math.random().toString(36).substring(2);
    const id3 = Math.random().toString(36).substring(2);
    notificacionAsignacion = {
      id: id,
      leido: false,
      solicitudId: this.solicitud.id,
      texto: 'te ha asignado como Interventor de una solictud.',
      fecha: new Date(),
      actor: this.usuario.perfil.nombre
    };

    notificacionAvance = {
      id: id2,
      leido: false,
      solicitudId: this.solicitud.id,
      texto: 'ha completado una tarea del proceso al cual estás vinculado.',
      actor: this.usuario.perfil.nombre,
      fecha: new Date(),
      task: this.task.name
    };

    notificacionOficina = {
      id: id,
      leido: false,
      solicitudId: this.solicitud.id,
      texto: 'Es tu hora de intervenir en el proceso de la solicitud',
      fecha: new Date()
    };
    this.notificacionService.notifyPlaneacion(notificacionAvance);
    this.notificacionService.notifyUsuarioWithId(notificacionAsignacion, this.interventorId);
    this.notificacionService.notifyOficinaContratacion(notificacionOficina);
    if(this.solicitud.usuario.perfil.nombre !== 'Planta Física'){
      this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
    }
  }

  //Metodo para general las variables a guardar en camunda.
  generateVariablesFromFormFields() {
    const variables = {
      variables: {
        interventorId: null
      }
    };
    variables.variables.interventorId = {
      value: this.interventorId
    };
    return variables;
  }

  getVariables(){
    this.cargando = false;
  }

  // Metodo para obtener las variables historicas que se van a usar.
  getVariables2(variables) {
    for(let variable of variables){
      if(variable.name == 'interventorId'){
        this.interventorId = variable.value;
      }
    }
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
