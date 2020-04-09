import { CamundaRestService } from '../../services/camunda-rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faExclamation, faArrowCircleLeft, faSyncAlt, faSave } from '@fortawesome/free-solid-svg-icons'; // Iconos
import { AngularFireStorage } from '@angular/fire/storage';

// Servicios
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';

// Modelos
import { Task } from 'app/proceso/models/Task';
import { Usuario } from 'app/admin/models/usuario';
import { Solicitud } from 'app/solicitudes/models/solicitud';
import { Notificacion } from 'app/in/models/notificacion';

export class ComunTaskArchivosComponent {
	route: ActivatedRoute;
	router: Router;
	camundaRestService: CamundaRestService;
	solicitudService: SolicitudService;
	swal: ShowMessagesService;
	usuarioService: UsuarioService;
	authService: AuthService;
	storage: AngularFireStorage;
	notificacionService: NotificacionService;

	public procesoId: string;
	public taskId: string;
	public formKey: string;
	historyVariables: [] = [];
	public task: Task;
	cargando: boolean;
	usuario: Usuario;
	solicitud: Solicitud;
	public ngUnsubscribe: Subject<any> = new Subject<any>();

	//Iconos
	faExclamation = faExclamation;
	faArrowCircleLeft = faArrowCircleLeft;
	faSyncAlt = faSyncAlt;
	faSave = faSave;

	constructor({
		route,
		router,
		camundaRestService,
		solicitudService,
		swal,
		usuarioService,
		authService,
		storage,
		notificacionService,
	}: {
		route: ActivatedRoute;
		router: Router;
		camundaRestService: CamundaRestService;
		solicitudService: SolicitudService;
		swal: ShowMessagesService;
		usuarioService: UsuarioService;
		authService: AuthService;
		storage: AngularFireStorage;
		notificacionService: NotificacionService;
	}) {
		this.route = route;
		this.router = router;
		this.camundaRestService = camundaRestService;
		this.solicitudService = solicitudService;
		this.swal = swal;
		this.usuarioService = usuarioService;
		this.authService = authService;
		this.storage = storage;
		this.notificacionService = notificacionService;
	}
	metodoInicial(): void {
		this.cargando = true;
		this.route.params.subscribe((params) => {
			this.procesoId = params['id'];
			this.taskId = params['taskId'];
			this.formKey = params['formKey'];
		});
		this.getCurrentUser();
		this.getSolicitud();
		if (this.formKey == null) {
			this.getTask(this.taskId);
			this.getHistoryVariables();
		} else {
			this.getTaskHistory(this.taskId);
			this.getHistoryVariables2();
		}
	}

	completeTask(variables): void {
		this.camundaRestService.postCompleteTask(this.taskId, variables).subscribe((data) => {
			this.router.navigate(['/modProceso/tasklist', this.procesoId]);
		});
	}

	/**
	 * Metodo para enviar las respectivas notificaciones a cada uno de los actores del proceso
	 * segùn la tarea.
	 */
	enviarNotificaciones(): void {
		const id = Math.random().toString(36).substring(2);
		const notificacionAvance: Notificacion = {
			id: id,
			leido: false,
			solicitudId: this.solicitud.id,
			texto: 'ha completado una tarea del proceso al cual estás vinculado.',
			actor: this.usuario.perfil.nombre,
			fecha: new Date(),
			task: this.task.name,
		};
		if (this.task.assignee === 'Planta Física') {
			this.notificacionService.notifyPlaneacion(notificacionAvance);
			if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
				this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
			}
		} else if (this.task.assignee === 'Planeación') {
			this.notificacionService.notifyPlantaFisica(notificacionAvance);
			if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
				this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
			}
		} else if (this.task.assignee === 'Solicitante') {
			this.notificacionService.notifyPlaneacion(notificacionAvance);
			if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
				this.notificacionService.notifyPlantaFisica(notificacionAvance);
			}
		} else if (
			this.task.assignee === 'UAA Asesora' ||
			this.task.assignee === 'Oficina de Contratación' ||
			this.task.assignee === 'Interventor'
		) {
			this.notificacionService.notifyPlantaFisica(notificacionAvance);
			this.notificacionService.notifyPlaneacion(notificacionAvance);
			if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
				this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
			}
		}
	}

	// Metodo para saber si hay un usuario logeado actualmente y obtener su información.
	getCurrentUser(): void {
		this.authService
			.estaAutenticado()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((user) => {
				if (user) {
					this.usuarioService
						.getUsuario(user.uid)
						.pipe(takeUntil(this.ngUnsubscribe))
						.subscribe((usuario: Usuario) => {
							// Obtenemos la información del usuario de la base de datos de firebase.
							this.usuario = usuario;
						});
				}
			});
	}

	/**
	 * Metodo para obtener la solicitud asociada al proceso.
	 */
	getSolicitud(): void {
		this.solicitudService
			.getSolicitudProcess(this.procesoId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((solicitud) => {
				this.solicitud = solicitud[0];
			});
	}

	/**
	 * Metodo para buscar una tarea en especifico.
	 * @param id id de la tarea a consultar
	 */
	getTask(id: string): void {
		this.camundaRestService.getTask(id).subscribe((task) => {
			this.task = task;
		});
	}

	/**
	 * Metodo para buscar una tarea que ya fue realizada.
	 * @param id id de la tarea a consultar
	 */
	getTaskHistory(id: string): void {
		this.camundaRestService.getTaskHistory(id).subscribe((task) => {
			this.task = task[0];
		});
	}

	// Metodo para obtener todas las variables que han sido guardadas en el proceso cuando la tarea no se ha realizado.
	getHistoryVariables(): void {
		this.camundaRestService
			.getHistoryVariables(this.procesoId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((variables) => {
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
			.subscribe((variables) => {
				this.historyVariables = variables;
				this.getVariables2(variables);
			});
	}

	// Metodo para agregar las variables historicas al modelo cuando la tarea ya fue realizada.
	getVariables2(variables) {}

	/**
	 * Metodo para devolverse a ver las tareas del proceso.
	 */
	irATareas(): void {
		this.router.navigate(['/modProceso/tasklist', this.procesoId]);
	}
}
