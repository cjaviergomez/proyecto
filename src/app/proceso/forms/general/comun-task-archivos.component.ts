import { CamundaRestService } from '../../services/camunda-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faExclamation, faArrowCircleLeft, faSyncAlt, faSave } from '@fortawesome/free-solid-svg-icons'; // Iconos
import { AngularFireStorage } from '@angular/fire/storage';

// Servicios
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';

//Modelos
import { Task } from 'app/proceso/models/Task';
import { Usuario } from 'app/admin/models/usuario';

export class ComunTaskArchivosComponent {

  route: ActivatedRoute;
  router: Router;
  camundaRestService: CamundaRestService;
  solicitudService: SolicitudService;
  swal: ShowMessagesService;
  usuarioService: UsuarioService;
  authService: AuthService;
  storage: AngularFireStorage;

  public procesoId: string;
  public taskId: string;
  public formKey: string;
  historyVariables: [] = [];
  public task: Task;
  cargando: boolean;
  usuario: Usuario;
  public ngUnsubscribe: Subject<any> = new Subject<any>();

   //Iconos
   faExclamation = faExclamation;
   faArrowCircleLeft = faArrowCircleLeft;
   faSyncAlt = faSyncAlt;
   faSave = faSave;

  constructor(route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    solicitudService: SolicitudService,
    swal: ShowMessagesService,
    usuarioService: UsuarioService,
    authService: AuthService,
    storage: AngularFireStorage
    ) {
      this.route = route;
      this.router = router;
      this.camundaRestService = camundaRestService;
      this.solicitudService = solicitudService;
      this.swal = swal;
      this.usuarioService = usuarioService;
      this.authService = authService;
      this.storage = storage;
  }
  metodoInicial() {
    this.cargando = true;
    this.route.params.subscribe(params => {
      this.procesoId = params['id'];
      this.taskId = params['taskId'];
      this.formKey = params['formKey'];
    });
    this.getCurrentUser();
    if(this.formKey == null){
      this.getTask(this.taskId);
      this.getHistoryVariables();
    } else {
      this.getTaskHistory(this.taskId);
      this.getHistoryVariables2();
    }
  }

  completeTask(variables){
    this.camundaRestService.postCompleteTask(this.taskId, variables).subscribe((data) => {
      this.router.navigate(['/modProceso/tasklist', this.procesoId]);
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
    });
  }

  /**
   * Metodo para buscar una tarea que ya fue realizada.
   * @param id id de la tarea a consultar
   */
  getTaskHistory(id: string) {
    this.camundaRestService.getTaskHistory(id).subscribe( task => {
      this.task = task[0];
    });
  }

  // Metodo para obtener todas las variables que han sido guardadas en el proceso cuando la tarea no se ha realizado.
  getHistoryVariables(): void {
    this.camundaRestService
      .getHistoryVariables(this.procesoId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(variables => {
        this.historyVariables = variables;
        this.getVariables(variables);
      });
  }

  // Metodo para agregar las variables historicas al modelo cuando la tarea aun no se ha realizado
  getVariables(variables) {}

  // Metodo para obtener todas las variables que han sido guardadas en el proceso cuando la tarea ya fue realizada.
  getHistoryVariables2(): void {
    this.camundaRestService
      .getHistoryVariables(this.procesoId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(variables => {
        this.historyVariables = variables;
        this.getVariables2(variables);
      });
  }

  // Metodo para agregar las variables historicas al modelo cuando la tarea ya fue realizada.
  getVariables2(variables) {}

  /**
   * Metodo para devolverse a ver las tareas del proceso.
   */
  irATareas() {
    this.router.navigate(['/modProceso/tasklist', this.procesoId]);
  }

}
