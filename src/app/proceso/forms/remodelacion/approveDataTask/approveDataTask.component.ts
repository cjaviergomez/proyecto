import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
declare let $: any; // Para trabajar con el modal

import {
	faWindowClose,
	faSearch,
	faPlus,
	faArrowCircleRight,
	faEye,
	faEyeSlash,
	faCheck,
	faTimes
} from '@fortawesome/free-solid-svg-icons'; // Iconos

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

// Modelos
import { Unidad } from 'app/admin/models/unidad';
import { Material } from 'app/proceso/models/material';
import { MyProcessData } from 'app/proceso/models/MyProcessData';
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
	styleUrls: []
})
export class approveDataTaskComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	mostrarF = false;
	seccion: number;
	public unidad: Unidad;
	model = new MyProcessData([], [], [], '', false);

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
	faArrowCircleRight = faArrowCircleRight; // Flecha del botón siguiente.
	faEye = faEye; //Icono para mostar formulario
	faEyeSlash = faEyeSlash; // Icono para ocultar formulario
	faCheck = faCheck; //Icono para aceptar solicitud.
	faTimes = faTimes; //Icono para rechazar la solicitud.

	constructor(
		route: ActivatedRoute,
		router: Router,
		camundaRestService: CamundaRestService,
		solicitudService: SolicitudService,
		swal: ShowMessagesService,
		usuarioService: UsuarioService,
		authService: AuthService,
		notificacionService: NotificacionService,
		private unidadService: UnidadService,
		private materialService: MaterialesService
	) {
		super(
			route,
			router,
			camundaRestService,
			solicitudService,
			swal,
			usuarioService,
			authService,
			notificacionService
		);
	}

	/**
	 * Este método forma parte del ciclo de vida del componente y
	 * se ejecuta tan pronto se inicia el componente.
	 */
	ngOnInit(): void {
		this.seccion = 1;
		this.metodoInicial();
		if (this.formKey == null) {
			const variableNames = Object.keys(this.model).join(',');
			this.loadExistingVariables(this.taskId, variableNames);
		}
		setTimeout(() => {
			this.getUnidad(this.solicitud.usuario.unidad_id);
		}, 2000);
	}

	/**
	 * Método para leer de camunda las variables a usar en el modelo
	 * @param taskId id de la tarea
	 * @param variableNames variables a buscar
	 */
	loadExistingVariables(taskId: string, variableNames: string): void {
		this.camundaRestService.getVariablesForTask(taskId, variableNames).subscribe((result) => {
			this.generateModelFromVariables(result);
		});
	}

	/**
	 * Método para crear el modelo apartir de las variables encontradas en Camunda
	 * @param variables variables de Camunda
	 */
	generateModelFromVariables(variables): void {
		Object.keys(variables).forEach((variableName) => {
			this.model[variableName] = variables[variableName].value;
		});
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea aun NO se ha realizado
	 * @param variables variables que han sido guardas en camunda con anterioridad.
	 */
	getVariables(variables): void {
		for (const variable of variables) {
			if (this.model[variable.name] != null) {
				this.model[variable.name] = variable.value;
			}
		}
		this.cargando = false;
	}

	/**
	 * Método para obtener la Unidad academica administrativa del usuario usando el metodo getUnidad del servicio.
	 * @param id id de la unidad a buscar
	 */
	getUnidad(id: string): void {
		this.unidadService.getUnidad(id).subscribe((unidad) => {
			this.unidad = unidad;
			this.cargando = false;
		});
	}

	enviarRespuesta(valor: boolean): void {
		this.model.approved = valor;
		if (valor === true) {
			this.swal
				.showQuestionMessage('responderSolicitud', null, 'aceptar')
				.then((resp) => {
					if (resp.value) {
						this.solicitudService
							.updateSolicitud(this.solicitud)
							.then(() => {
								const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
								this.enviarNotificaciones();
								this.completeTask(variables);
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
						this.solicitud.estado = 'Rechazada';
						this.solicitudService.updateSolicitud(this.solicitud).then(() => {
							//Notificar el cambio de estado y avance en la solicitud.
							const id = Math.random().toString(36).substring(2);
							const id2 = Math.random().toString(36).substring(2);
							const notificacionEstado: Notificacion = {
								id: id,
								leido: false,
								solicitudId: this.solicitud.id,
								texto: 'El estado de su solicitud ha cambiado.',
								fecha: new Date()
							};

							const notificacionAvance: Notificacion = {
								id: id2,
								leido: false,
								solicitudId: this.solicitud.id,
								texto: 'ha completado una tarea del proceso al cual estás vinculado.',
								actor: this.usuario.perfil.nombre,
								fecha: new Date(),
								task: this.task.name
							};
							this.notificacionService.notifyPlaneacion(notificacionAvance);
							if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
								this.notificacionService.notifyUsuario(notificacionEstado, this.solicitud.usuario);
								setTimeout(() => {
									this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
								}, 1000);
							}
							const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
							this.completeTask(variables);
						});
					}
				})
				.catch((err) => {
					this.swal.showErrorMessage('');
				});
		}
	}

	/**
	 * Método para generar las variables a guardar en Camunda.
	 */
	generateVariablesFromFormFields() {
		const variables = {
			variables: {}
		};
		Object.keys(this.model).forEach((field) => {
			variables.variables[field] = {
				value: this.model[field]
			};
		});

		return variables;
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
}
