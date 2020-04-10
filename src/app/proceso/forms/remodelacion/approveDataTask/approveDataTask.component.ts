import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
declare let $: any; // Para trabajar con el modal

import {
	faWindowClose,
	faSearch,
	faPlus,
	faExclamation,
	faArrowCircleRight,
	faArrowCircleLeft,
	faSyncAlt,
	faEye,
	faEyeSlash,
	faCheck,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'; // Iconos

// Componentes
import { CompleteTaskComponent } from '../../general/complete-task.component';

// Modelos
import { Task } from 'app/proceso/models/Task';
import { Solicitud } from 'app/solicitudes/models/solicitud';
import { Unidad } from 'app/admin/models/unidad';
import { Material } from 'app/proceso/models/material';
import { Usuario } from 'app/admin/models/usuario';
import { Notificacion } from 'app/in/models/notificacion';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { UnidadService } from '../../../../admin/services/unidad.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { MaterialesService } from '../../../services/materiales.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
	selector: 'approveDataTask',
	templateUrl: './approveDataTask.component.html',
	styleUrls: [],
})
export class approveDataTaskComponent extends CompleteTaskComponent implements OnDestroy {
	mostrarF = false;
	seccion: number;
	cargando: boolean;
	usuario: Usuario;
	public procesoId: string;
	public taskId: string;
	public formKey: string;
	public task: Task;
	solicitud: Solicitud[];
	private ngUnsubscribe: Subject<any> = new Subject<any>();
	public unidad: Unidad;

	filterPost = ''; // Texto a buscar en los materiales.
	filterElements = ''; // Texto a buscar en los elementos de protección.
	filterEspecials = ''; // Texto a buscar en los especiales.

	materiales: Material[]; //Materiales encontrados en la base de datos.
	elementosPro: Material[]; // Elementos de protección encontrados en la base de datos.
	especiales: Material[]; // Acciones especiales encontradas en la base de datos.

	material = new Material(); //Modelo del material a agregar a la base de datos.
	elementoPro = new Material(); //Modelo del elemento de protección a agregar a la base de datos.
	especial = new Material(); //Modelo de la accion especial a agregar a la base de datos.

	faWindowClose = faWindowClose;
	faSearch = faSearch;
	faPlus = faPlus;
	faExclamation = faExclamation;
	faArrowCircleRight = faArrowCircleRight; // Flecha del botón siguiente.
	faArrowCircleLeft = faArrowCircleLeft; // Flecha del botón atrás
	faSyncAlt = faSyncAlt;
	faEye = faEye; //Icono para mostar formulario
	faEyeSlash = faEyeSlash; // Icono para ocultar formulario
	faCheck = faCheck; //Icono para aceptar solicitud.
	faTimes = faTimes; //Icono para rechazar la solicitud.

	// Notificaciones
	notificacionEstado: Notificacion;
	notificacionAvance: Notificacion;

	constructor(
		route: ActivatedRoute,
		router: Router,
		camundaRestService: CamundaRestService,
		solicitudService: SolicitudService,
		unidadService: UnidadService,
		swal: ShowMessagesService,
		materialService: MaterialesService,
		usuarioService: UsuarioService,
		authService: AuthService,
		private notificacionService: NotificacionService
	) {
		super(
			route,
			router,
			camundaRestService,
			solicitudService,
			unidadService,
			swal,
			materialService,
			usuarioService,
			authService
		);
		this.cargando = true;
		this.seccion = 1;
		this.route.params.subscribe((params) => {
			this.procesoId = params['id'];
			this.taskId = params['taskId'];
			this.formKey = params['formKey'];
			if (this.formKey == null) {
				const variableNames = Object.keys(this.model).join(',');
				this.loadExistingVariables(this.taskId, variableNames);
			}
		});
		this.getCurrentUser();
		this.getHistoryVariables();
		this.getSolicitud();
		if (this.formKey == null) {
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
				this.solicitud = solicitud;
				this.getUnidad(this.solicitud[0].usuario.unidad_id);
			});
	}

	/**
	 * Metodo para devolverse a ver las tareas del proceso.
	 */
	irATareas(): void {
		this.router.navigate(['/modProceso/tasklist', this.procesoId]);
	}

	// Metodo para obtener todas las variables que han sido guardadas en el proceso.
	getHistoryVariables(): void {
		this.camundaRestService
			.getHistoryVariables(this.procesoId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((variables) => {
				this.generateModel(variables);
			});
	}

	// Metodo para agregar las variables historicas al modelo.
	generateModel(variables): void {
		for (const variable of variables) {
			if (this.model[variable.name] != null) {
				this.model[variable.name] = variable.value;
			}
		}
	}

	seccionSiguiente(): void {
		this.seccion = this.seccion + 1;
	}

	seccionAnterior(): void {
		this.seccion = this.seccion - 1;
	}

	actualSeccion(sesion: number): void {
		this.seccion = sesion;
	}

	//Metodo para obtener la Unidad academica administrativa del usuario usando el metodo getUnidad del servicio.
	getUnidad(id: string): void {
		this.unidadService.getUnidad(id).subscribe((unidad) => {
			this.unidad = unidad;
			this.cargando = false;
		});
	}

	buscarMateriales(): void {
		if (this.filterPost.length === 0) {
			return;
		}
		this.swal.showLoading();
		this.materialService.getMaterial(this.filterPost).subscribe((materiales) => {
			this.swal.stopLoading();
			this.materiales = materiales;
			$('#buscarMaterial').modal('show');
		});
	}

	buscarElementos(): void {
		if (this.filterElements.length === 0) {
			return;
		}
		this.swal.showLoading();
		this.materialService.getElemento(this.filterElements).subscribe((elementos) => {
			this.swal.stopLoading();
			this.elementosPro = elementos;
			$('#buscarElementos').modal('show');
		});
	}

	buscarEspeciales(): void {
		if (this.filterEspecials.length === 0) {
			return;
		}
		this.swal.showLoading();
		this.materialService.getEspecial(this.filterEspecials).subscribe((especiales) => {
			this.swal.stopLoading();
			this.especiales = especiales;
			$('#buscarEspeciales').modal('show');
		});
	}

	guardarMaterial(form: NgForm, flat: string): void {
		console.log(flat);
		if (form.invalid) {
			return;
		}
		this.swal.showLoading();

		if (flat === 'material') {
			$('#addMaterial').modal('hide');
			this.materialService
				.addMaterial(this.material)
				.then(() => {
					form.resetForm();
					this.swal.stopLoading();
				})
				.catch(() => {
					this.swal.stopLoading();
					this.swal.showErrorMessage('');
				});
		} else if (flat === 'elemento') {
			$('#addElemento').modal('hide');
			this.materialService
				.addElemento(this.elementoPro)
				.then(() => {
					form.resetForm();
					this.swal.stopLoading();
				})
				.catch(() => {
					this.swal.stopLoading();
					this.swal.showErrorMessage('');
				});
		} else if (flat === 'especial') {
			$('#addEspecial').modal('hide');
			this.materialService
				.addEspecial(this.especial)
				.then(() => {
					form.resetForm();
					this.swal.stopLoading();
				})
				.catch(() => {
					this.swal.stopLoading();
					this.swal.showErrorMessage('');
				});
		}
	}

	cerrarModalMaterial(form: NgForm, flat: string): void {
		form.resetForm();
		if (flat === 'elemento') {
			$('#addElemento').modal('hide');
		} else if (flat === 'material') {
			$('#addMaterial').modal('hide');
		} else if (flat === 'especial') {
			$('#addEspecial').modal('hide');
		}
	}

	nuevoMaterial(flat: string): void {
		if (flat === 'material') {
			$('#addMaterial').modal('show');
		} else if (flat === 'elemento') {
			$('#addElemento').modal('show');
		} else if (flat === 'especial') {
			$('#addEspecial').modal('show');
		}
	}

	addMaterial(elemento: Material, flat: string): void {
		if (flat === 'materiales') {
			this.model.materiales.push(elemento);
		} else if (flat === 'elementos') {
			this.model.elementosProteccion.push(elemento);
		} else if (flat === 'especiales') {
			this.model.especiales.push(elemento);
		}
	}

	eliminarMaterial(index: number, flat: string): void {
		if (flat === 'material') {
			this.model.materiales.splice(index, 1);
		} else if (flat === 'elemento') {
			this.model.elementosProteccion.splice(index, 1);
		} else if (flat === 'especial') {
			this.model.especiales.splice(index, 1);
		}
	}

	mostrarFormulario(valor: boolean): void {
		this.mostrarF = valor;
	}

	enviarRespuesta(valor: boolean): void {
		const idSoli = this.solicitud[0].id;
		this.model.approved = valor;
		if (valor === true) {
			this.swal
				.showQuestionMessage('responderSolicitud', null, 'aceptar')
				.then((resp) => {
					if (resp.value) {
						this.solicitudService
							.updateSolicitud(this.solicitud[0])
							.then(() => {
								//Notificar el avance en el proceso.
								const id = Math.random().toString(36).substring(2);
								this.notificacionAvance = {
									id: id,
									leido: false,
									solicitudId: idSoli,
									texto: 'ha completado una tarea del proceso al cual estás vinculado.',
									actor: this.usuario.perfil.nombre,
									fecha: new Date(),
									task: this.task.name,
								};
								this.notificacionService.notifyPlaneacion(this.notificacionAvance);
								if (this.solicitud[0].usuario.perfil.nombre !== 'Planta Física') {
									this.notificacionService.notifyUsuario(this.notificacionAvance, this.solicitud[0].usuario);
								}
								this.onSubmit();
							})
							.catch((err) => {
								console.log(err);
							});
					}
				})
				.catch((error) => {
					this.swal.showErrorMessage('');
				});
		} else {
			this.swal
				.showQuestionMessage('responderSolicitud', null, 'rechazar')
				.then((resp) => {
					if (resp.value) {
						this.solicitud[0].estado = 'Rechazada';
						this.solicitudService.updateSolicitud(this.solicitud[0]).then(() => {
							//Notificar el cambio de estado y avance en la solicitud.
							const id = Math.random().toString(36).substring(2);
							const id2 = Math.random().toString(36).substring(2);
							this.notificacionEstado = {
								id: id,
								leido: false,
								solicitudId: this.solicitud[0].id,
								texto: 'El estado de su solicitud ha cambiado.',
								fecha: new Date(),
							};

							this.notificacionAvance = {
								id: id2,
								leido: false,
								solicitudId: this.solicitud[0].id,
								texto: 'ha completado una tarea del proceso al cual estás vinculado.',
								actor: this.usuario.perfil.nombre,
								fecha: new Date(),
								task: this.task.name,
							};
							this.notificacionService.notifyPlaneacion(this.notificacionAvance);
							if (this.solicitud[0].usuario.perfil.nombre !== 'Planta Física') {
								this.notificacionService.notifyUsuario(this.notificacionEstado, this.solicitud[0].usuario);
								setTimeout(() => {
									this.notificacionService.notifyUsuario(this.notificacionAvance, this.solicitud[0].usuario);
								}, 1000);
							}
							this.onSubmit();
						});
					}
				})
				.catch((err) => {
					this.swal.showErrorMessage('');
				});
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
