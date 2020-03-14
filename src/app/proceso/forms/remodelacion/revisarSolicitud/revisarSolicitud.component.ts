import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faExclamation, faArrowCircleLeft, faSyncAlt } from '@fortawesome/free-solid-svg-icons'; // Iconos

// Modelos
import { Usuario } from 'app/admin/models/usuario';
import { Solicitud } from 'app/solicitudes/models/solicitud';
import { Task } from 'app/proceso/models/Task';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { AuthService } from '../../../../out/services/auth.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';

@Component({
  selector: 'app-revisar-solicitud',
  templateUrl: './revisarSolicitud.component.html',
  styleUrls: ['./revisarSolicitud.component.css']
})
export class revisarSolicitudComponent implements OnInit, OnDestroy {

  usuario: Usuario;
  solicitud: Solicitud[];
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  public procesoId: string;
  public taskId: string;
  public formKey: string;
  public task: Task;
  cargando: boolean;

  //Iconos
  faExclamation = faExclamation;
  faArrowCircleLeft = faArrowCircleLeft;
  faSyncAlt = faSyncAlt;

  constructor(private camundaRestService: CamundaRestService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private usuarioService: UsuarioService,
              private solicitudService: SolicitudService,
              private swal: ShowMessagesService) { }

  ngOnInit() {
    this.cargando = true;
    this.getCurrentUser();
    this.route.params.subscribe(params => {
      this.procesoId = params['id'];
      this.taskId = params['taskId'];
      this.formKey = params['formKey'];
    });
    this.getSolicitud();
    if(this.formKey == null){
      this.getTask(this.taskId);
    } else {
      this.getTaskHistory(this.taskId);
    }

  }

  /**
   * Metodo para completar la tarea
   * Esta tarea cambia el estado de la reforma a 'En trámite'.
   */
  completarTarea() {
    this.swal.showLoading();
    this.solicitud[0].estado = 'En trámite';
    this.camundaRestService.postCompleteTask(this.taskId, {}).subscribe(() => {
      this.solicitudService.updateSolicitud(this.solicitud[0]).then(()=>{
        this.swal.stopLoading();
        this.router.navigate(['/modProceso/tasklist', this.procesoId]);
      }).catch((err) => {
        this.swal.stopLoading();
        this.swal.showErrorMessage('');
      });
    });
  }

  // Metodo para saber si hay un usuario logeado actualmente y obtener su información.
  getCurrentUser(){
    this.authService.estaAutenticado()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( user => {
      if(user){
        this.usuarioService.getUsuario(user.uid)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((usuario: Usuario) => {
          // Obtenemos la información del usuario de la base de datos de firebase.
          this.usuario = usuario;
        });
      }
    });
  }

  /**
   * Metodo para buscar una tarea en especifico.
   * @param id id de la tarea a consultar
   */
  getTask(id: string) {
    this.camundaRestService.getTask(id).subscribe( task => {
      this.task = task;
      this.cargando = false;
    });
  }

  /**
   * Metodo para buscar una tarea que ya fue realizada.
   * @param id id de la tarea a consultar
   */
  getTaskHistory(id: string) {
    this.camundaRestService.getTaskHistory(id).subscribe( task => {
      this.task = task[0];
      this.cargando = false;
    });
  }

  /**
   * Metodo para obtener la solicitud asociada al proceso.
   */
  getSolicitud() {
    this.solicitudService.getSolicitudProcess(this.procesoId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( solicitud => {
          this.solicitud = solicitud;
        });
  }

  /**
   * Metodo para devolverse a ver las tareas del proceso.
   */
  irATareas() {
    this.router.navigate(['/modProceso/tasklist', this.procesoId]);
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