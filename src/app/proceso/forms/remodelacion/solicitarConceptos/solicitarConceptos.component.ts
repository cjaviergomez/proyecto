import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ComunTaskComponent } from '../../general/comun-task.component';
import Swal from 'sweetalert2';

// Modelos
import { Usuario } from '../../../../admin/models/usuario';
import { Notificacion } from 'app/in/models/notificacion';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
  selector: 'app-solicitar-conceptos',
  templateUrl: './solicitarConceptos.component.html',
  styleUrls: ['./solicitarConceptos.component.css']
})
export class solicitarConceptosComponent extends ComunTaskComponent implements OnInit, OnDestroy {

  nombresDSI: Usuario[] = [];
  nombresMT: Usuario[] = [];
  nombresPlaneacion: Usuario[] = [];

  planeacionId: string = null;
  desiId: string = null;
  mantenimientoId: string = null;

  constructor(route: ActivatedRoute,
              router: Router,
              camundaRestService: CamundaRestService,
              solicitudService: SolicitudService,
              swal: ShowMessagesService,
              usuarioService: UsuarioService,
              authService: AuthService,
              private notificacionService: NotificacionService) {
    super(route, router, camundaRestService, solicitudService, swal, usuarioService, authService);
    }

  ngOnInit() {
    this.metodoInicial();
    this.getUsuarios();
  }

  //Metodo para obtener los usuario con los distintos perfiles de la base de datos.
  getUsuarios(){
    this.usuarioService.getUsuariosPlaneacion()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(usuariosP => {
          this.nombresPlaneacion = usuariosP;
    });

    this.usuarioService.getUsuariosAreas('JQj5yQY4Zj6rlDniQpZC')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(usuariosD => {
          this.nombresDSI = usuariosD;
        });
    this.usuarioService.getUsuariosAreas('KBWyuAsDaUY66w49yXy9')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(usuariosM => {
          this.nombresMT = usuariosM;
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

  //Metodo para general las variables a guardar en camunda.
  generateVariablesFromFormFields() {
    const variables = {
      variables: {
        planeacionId: null,
        desiId: null,
        mantenimientoId: null
      }
    };
    variables.variables.planeacionId = {
      value: this.planeacionId
    };
    variables.variables.desiId = {
      value: this.desiId
    };
    variables.variables.mantenimientoId = {
      value: this.mantenimientoId
    };
    return variables;
  }

  getVariables(){
    this.cargando = false;
  }

  // Metodo para obtener las variables historicas que se van a usar.
  getVariables2(variables) {
    for(let variable of variables){
      if(variable.name == 'planeacionId'){
        this.planeacionId = variable.value;
      } else if(variable.name == 'mantenimientoId'){
        this.mantenimientoId = variable.value;
      } else if(variable.name == 'desiId'){
        this.desiId = variable.value;
      }
    }
    this.cargando = false;
  }

  /**
   * Metodo para enviar las respectivas notificaciones a cada uno de los actores del proceso
   * segùn la tarea.
   */
  enviarNotificaciones() {
    //Notificar el avance en el proceso y la asignaci+on de las uaas asesoras.
    let notificacionAsignacion: Notificacion;
    let notificacionAvance: Notificacion;
    const id = Math.random().toString(36).substring(2);
    const id2 = Math.random().toString(36).substring(2);
    notificacionAsignacion = {
      id: id,
      leido: false,
      solicitudId: this.solicitud.id,
      texto: 'te ha asignado como unidad asesora de una solictud.',
      fecha: new Date(),
      actor: this.usuario.perfil.nombre
    };

    notificacionAvance = {
      id: id2,
      leido: false,
      solicitudId: this.solicitud.id,
      texto: 'ha completado una tarea del proceso al cual estás vinculado.',
      actor: this.usuario.perfil.nombre,
      fecha: new Date()
    };
    this.notificacionService.notifyPlaneacion(notificacionAvance);
    setTimeout(()=> {
      this.notificacionService.notifyUsuarioWithId(notificacionAsignacion, this.planeacionId);
    }, 1000);
    this.notificacionService.notifyUsuarioWithId(notificacionAsignacion, this.desiId);
    this.notificacionService.notifyUsuarioWithId(notificacionAsignacion, this.mantenimientoId);
    if(this.solicitud.usuario.perfil.nombre !== 'Planta Física'){
      this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
    }
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
