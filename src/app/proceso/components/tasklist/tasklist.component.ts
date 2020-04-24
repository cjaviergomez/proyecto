import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare let $: any; // Para trabajar con el modal
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Iconos
import {
	faWindowClose,
	faSearch,
	faPlus,
	faExclamation,
	faArrowCircleRight,
	faArrowCircleLeft,
	faSave,
	faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

// Modelos
import { Task } from '../../models/Task';
import { Solicitud } from 'app/solicitudes/models/solicitud';
import { Unidad } from 'app/admin/models/unidad';
import { MyProcessData } from '../../models/MyProcessData';

// Servicios
import { CamundaRestService } from '../../services/camunda-rest.service';
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { UnidadService } from '../../../admin/services/unidad.service';

@Component({
	selector: 'app-tasklist',
	templateUrl: './tasklist.component.html',
	styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit, OnDestroy {
	tasks: Task[] = null;
	tasksComplete: Task[] = null;
	historyVariables: [] = [];
	processId: string;
	taskId: string;
	formKey: string;
	cargando = false;
	noFound = false;

	//Varibales para el formulario de solicitud.
	seccion: number;
	solicitud: Solicitud[];
	unidad: Unidad;
	model = new MyProcessData([], [], [], '', false);

	// Iconos
	faWindowClose = faWindowClose;
	faSearch = faSearch;
	faPlus = faPlus;
	faExclamation = faExclamation;
	faArrowCircleRight = faArrowCircleRight; // Flecha del botón siguiente.
	faArrowCircleLeft = faArrowCircleLeft; // Flecha del botón atrás
	faSave = faSave;
	faSyncAlt = faSyncAlt;

	private ngUnsubscribe: Subject<any> = new Subject<any>();

	constructor(
		private camundaRestService: CamundaRestService,
		private route: ActivatedRoute,
		private solictudService: SolicitudService,
		private unidadService: UnidadService
	) {}

	ngOnInit() {
		if (this.route.params != null) {
			this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
				if (params['id'] != null && params['taskId'] == null) {
					//Si no se ha seleccionado ninguna tarea
					this.cargando = true;
					this.processId = params['id'];
					this.getSolicitudProcess();
					this.getTasks();
					this.getHistoryVariables();
				} else if (params['id'] != null && params['taskId'] != null && params['formKey'] == null) {
					this.processId = params['id'];
					this.taskId = params['taskId'];
					this.getFormKey();
				} else if (params['id'] != null && params['taskId'] != null && params['formKey'] != null) {
					this.taskId = params['taskId'];
					this.formKey = params['formKey'];
				}
			});
		}
	}

	//Metodo para obtener el formulario de la tarea.
	getFormKey(): void {
		this.camundaRestService
			.getTaskFormKey(this.taskId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((formKey) => {
				this.formKey = formKey.key;
				if (!this.formKey) {
					this.noFound = true;
				}
			});
	}

	// Metodo para obtener las tareas a completar del proceso
	getTasks(): void {
		this.camundaRestService
			.getTasksProcess(this.processId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((tasks) => {
				this.tasks = tasks;
				this.getTasksComplete();
			});
	}

	// Metodo para obtener las tareas completadas del proceso.
	getTasksComplete(): void {
		this.camundaRestService
			.getTasksProcessComplete(this.processId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((tasks) => {
				this.tasksComplete = tasks;
				this.cargando = false;
			});
	}

	// Metodo para obtener todas las variables que han sido guardadas en el proceso.
	getHistoryVariables(): void {
		this.camundaRestService
			.getHistoryVariables(this.processId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((variables) => {
				this.historyVariables = variables;
				this.generateModelFromVariables(variables);
			});
	}

	// Metodo para obtener la solicitud que esta asociada al proceso.
	getSolicitudProcess() {
		this.solictudService
			.getSolicitudProcess(this.processId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((solicitud) => {
				if (solicitud.length > 0) {
					this.solicitud = solicitud;
					this.getUnidad(this.solicitud[0].usuario.unidad_id);
				}
			});
	}

	// Metodo para agregar las variables historicas al modelo
	generateModelFromVariables(variables) {
		for (const variable of variables) {
			if (this.model[variable.name] != null) {
				this.model[variable.name] = variable.value;
			}
		}
	}

	//Metodo para obtener la Unidad academica administrativa del usuario usando el metodo getUnidad del servicio.
	getUnidad(id: string) {
		this.unidadService
			.getUnidad(id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((unidad) => {
				this.unidad = unidad;
			});
	}

	// Metodo para ver el formulario de solicitud en un modal.
	verFormulario() {
		this.seccion = 1;
		$('#verFormulario').modal('show');
	}

	seccionSiguiente() {
		this.seccion = this.seccion + 1;
	}

	seccionAnterior() {
		this.seccion = this.seccion - 1;
	}

	actualSeccion(sesion: number) {
		this.seccion = sesion;
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
