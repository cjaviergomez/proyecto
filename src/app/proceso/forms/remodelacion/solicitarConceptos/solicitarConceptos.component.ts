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
              authService: AuthService) {
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