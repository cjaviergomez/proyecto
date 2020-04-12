import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

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
	styleUrls: ['./solicitarConceptos.component.css'],
})
export class solicitarConceptosComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	nombresDSI: Usuario[] = [];
	nombresMT: Usuario[] = [];
	nombresPlaneacion: Usuario[] = [];

	planeacionId: string = null;
	desiId: string = null;
	mantenimientoId: string = null;

	constructor(
		route: ActivatedRoute,
		router: Router,
		camundaRestService: CamundaRestService,
		solicitudService: SolicitudService,
		swal: ShowMessagesService,
		usuarioService: UsuarioService,
		authService: AuthService,
		notificacionService: NotificacionService
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
		this.metodoInicial();
		this.getUsuarios();
	}

	/**
	 * Método para obtener los usuario con los distintos perfiles de la base de datos.
	 */
	getUsuarios(): void {
		this.usuarioService
			.getUsuariosPlaneacion()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((usuariosP) => {
				this.nombresPlaneacion = usuariosP;
			});

		this.usuarioService
			.getUsuariosAreas('JQj5yQY4Zj6rlDniQpZC')
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((usuariosD) => {
				this.nombresDSI = usuariosD;
			});
		this.usuarioService
			.getUsuariosAreas('KBWyuAsDaUY66w49yXy9')
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((usuariosM) => {
				this.nombresMT = usuariosM;
			});
	}

	/**
	 * Método para general las variables a guardar en camunda.
	 */
	generateVariablesFromFormFields() {
		const variables = {
			variables: {
				planeacionId: null,
				desiId: null,
				mantenimientoId: null,
			},
		};
		variables.variables.planeacionId = {
			value: this.planeacionId,
		};
		variables.variables.desiId = {
			value: this.desiId,
		};
		variables.variables.mantenimientoId = {
			value: this.mantenimientoId,
		};
		return variables;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea ya fue realizada.
	 * @param variables variables guardas en camunda
	 */
	getVariables2(variables): void {
		for (const variable of variables) {
			if (variable.name == 'planeacionId') {
				this.planeacionId = variable.value;
			} else if (variable.name == 'mantenimientoId') {
				this.mantenimientoId = variable.value;
			} else if (variable.name == 'desiId') {
				this.desiId = variable.value;
			}
		}
		this.cargando = false;
	}

	/**
	 * Metodo para enviar las respectivas notificaciones a cada uno de los actores del proceso
	 * segùn la tarea.
	 */
	enviarNotificaciones(): void {
		//Notificar el avance en el proceso y la asignaci+on de las uaas asesoras.
		const id = Math.random().toString(36).substring(2);
		const id2 = Math.random().toString(36).substring(2);
		const notificacionAsignacion: Notificacion = {
			id: id,
			leido: false,
			solicitudId: this.solicitud.id,
			texto: 'te ha asignado como unidad asesora de una solictud.',
			fecha: new Date(),
			actor: this.usuario.perfil.nombre,
		};

		const notificacionAvance: Notificacion = {
			id: id2,
			leido: false,
			solicitudId: this.solicitud.id,
			texto: 'ha completado una tarea del proceso al cual estás vinculado.',
			actor: this.usuario.perfil.nombre,
			fecha: new Date(),
			task: this.task.name,
		};
		this.notificacionService.notifyPlaneacion(notificacionAvance);
		setTimeout(() => {
			this.notificacionService.notifyUsuarioWithId(notificacionAsignacion, this.planeacionId);
		}, 1000);
		this.notificacionService.notifyUsuarioWithId(notificacionAsignacion, this.desiId);
		this.notificacionService.notifyUsuarioWithId(notificacionAsignacion, this.mantenimientoId);
		if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
			this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
		}
	}
}
