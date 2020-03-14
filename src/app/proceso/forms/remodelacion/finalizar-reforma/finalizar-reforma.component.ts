import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { faUsers} from '@fortawesome/free-solid-svg-icons'; // Iconos
import { DatePipe } from '@angular/common';
import { ComunTaskComponent } from '../../general/comun-task.component';

// Modelos
import { Solicitud } from 'app/solicitudes/models/solicitud';
import { Reforma } from 'app/reformas/models/reforma';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { ReformaService } from '../../../../reformas/services/reforma.service';

@Component({
  selector: 'app-finalizar-reforma',
  templateUrl: './finalizar-reforma.component.html',
  styleUrls: ['./finalizar-reforma.component.css']
})
export class finalizarReformaComponent extends ComunTaskComponent implements OnInit, OnDestroy {

  solicitud: Solicitud;
  reforma: Reforma;
  faUsers = faUsers;
  fechaActual;
  datePipe: DatePipe

  reformaService: ReformaService;

  constructor(route: ActivatedRoute,
              router: Router,
              camundaRestService: CamundaRestService,
              solicitudService: SolicitudService,
              swal: ShowMessagesService,
              usuarioService: UsuarioService,
              authService: AuthService,
              datePipe: DatePipe,
              reformaService: ReformaService) {
    super(route, router, camundaRestService, solicitudService, swal, usuarioService, authService);
    this.datePipe = datePipe;
    this.reformaService = reformaService;
  }

  ngOnInit() {
    this.metodoInicial();
    this.getSolicitud();
    this.fechaActual = new Date();
    this.fechaActual = this.datePipe.transform(this.fechaActual, 'dd/MM/yyyy');
  }

  getSolicitud(){
    this.solicitudService.getSolicitudProcess(this.procesoId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(solicitud => {
          this.solicitud = solicitud[0];
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
    }).then(resp => {
      if(resp.value) {
        this.swal.showLoading();
        this.solicitud.estado = 'Finalizada';

        this.solicitudService.updateSolicitud(this.solicitud).then(() => {

          this.reforma = {
            nombre_edificio: this.solicitud.nombre_edificio,
            usuario: this.solicitud.usuario,
            descripcion: this.solicitud.descripcion,
            piso_edificio: this.solicitud.piso_edificio,
            fecha: this.fechaActual,
            objectID: this.solicitud.objectID,
            nombre_subcapa: this.solicitud.nombre_subcapa,
            idProccess: this.solicitud.idProcess
          };

          this.reformaService.addReforma(this.reforma).then(()=> {
            const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
            this.completeTask(variables);
            this.swal.stopLoading();
          }).catch((err)=> {
            this.swal.stopLoading();
            this.swal.showErrorMessage('');
          });

        }).catch((err)=> {
          this.swal.stopLoading();
          this.swal.showErrorMessage('');
        });
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
