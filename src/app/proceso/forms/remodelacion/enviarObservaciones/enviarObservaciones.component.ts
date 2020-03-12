import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faExclamation, faArrowCircleLeft, faSyncAlt, faSave } from '@fortawesome/free-solid-svg-icons'; // Iconos
import Swal from 'sweetalert2';

// Modelos
import { Task } from 'app/proceso/models/Task';
import { Usuario } from 'app/admin/models/usuario';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';

@Component({
  selector: 'app-enviar-observaciones',
  templateUrl: './enviarObservaciones.component.html',
  styleUrls: ['./enviarObservaciones.component.css']
})
export class enviarObservacionesComponent implements OnInit, OnDestroy {

  public procesoId: string;
  public taskId: string;
  public formKey: string;
  public task: Task;
  cargando: boolean;
  historyVariables: [] = [];
  usuario: Usuario;
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //Iconos
  faExclamation = faExclamation;
  faArrowCircleLeft = faArrowCircleLeft;
  faSyncAlt = faSyncAlt;
  faSave = faSave;

  observacionesP: string; //Propio de la tarea.

  constructor(private route: ActivatedRoute,
              private router: Router,
              private camundaRestService: CamundaRestService,
              private usuarioService: UsuarioService,
              private authService: AuthService) { }

  ngOnInit() {
    this.cargando = true;
    this.route.params.subscribe(params => {
      this.procesoId = params['id'];
      this.taskId = params['taskId'];
      this.formKey = params['formKey'];
    });
    this.getCurrentUser();
    if(this.formKey == null){
      this.getTask(this.taskId);
    } else {
      this.getTaskHistory(this.taskId);
      this.getHistoryVariables();
    }
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
    });
  }

   // Metodo para obtener todas las variables que han sido guardadas en el proceso.
   getHistoryVariables(): void {
    this.camundaRestService
      .getHistoryVariables(this.procesoId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(variables => {
        this.historyVariables = variables;
        this.getVariable(variables);
      });
  }

  // Metodo para agregar las variables historicas al modelo
  getVariable(variables) {
    for(let variable of variables){
      if(variable.name == 'observacionesP'){
        this.observacionesP = variable.value;
        this.cargando = false;
        return;
      }
    }
   }

  /**
   * Metodo para devolverse a ver las tareas del proceso.
   */
  irATareas() {
    this.router.navigate(['/modProceso/tasklist', this.procesoId]);
  }

  enviarComentarios(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea enviar las observaciones?`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp =>{
      if(resp.value) {
        const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
        this.camundaRestService.postCompleteTask(this.taskId, variables).subscribe(()=>{
          this.router.navigate(['/modProceso/tasklist', this.procesoId]);
        });
      }
    });
  }

  generateVariablesFromFormFields() {
    const variables = {
      variables: {
        observacionesP: null
      }
    };
    variables.variables.observacionesP = {
      value: this.observacionesP
    };
    return variables;
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
