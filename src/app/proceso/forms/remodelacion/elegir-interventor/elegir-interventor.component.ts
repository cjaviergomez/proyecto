import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

// Modelos
import { Usuario } from '../../../../admin/models/usuario';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';
import { Notificacion } from 'app/in/models/notificacion';

@Component({
	selector: 'app-elegir-interventor',
	templateUrl: './elegir-interventor.component.html',
	styleUrls: ['./elegir-interventor.component.css']
})
export class elegirInterventorComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	nombresInterventor: Usuario[] = [];
	interventorId: string = null;

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
	 * Método para obtener los usuario con el perfil Interventor de la base de datos.
	 */
	getUsuarios(): void {
		this.usuarioService
			.getUsuariosInterventor()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((usuariosP) => {
				this.nombresInterventor = usuariosP;
			});
	}

	/**
	 * Método para enviar la información de la tarea y terminarla.
	 */
	completarTarea(): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `¿Está seguro que desea enviar las observaciones?`,
			type: 'question',
			showConfirmButton: true,
			showCancelButton: true
		}).then((resp) => {
			if (resp.value) {
				this.solicitud.interventorId = this.interventorId;
				this.solicitudService.updateSolicitud(this.solicitud).then(() => {
					const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
					this.enviarNotificaciones();
					this.completeTask(variables);
				});
			}
		});
	}

	/**
	 * Metodo para enviar las respectivas notificaciones a cada uno de los actores del proceso
	 * segùn la tarea.
	 */
	enviarNotificaciones(): void {
		//Notificar el avance en el proceso y la asignación al interventor.
		const id = Math.random().toString(36).substring(2);
		const id2 = Math.random().toString(36).substring(2);
		const id3 = Math.random().toString(36).substring(2);

		const notificacionAsignacion: Notificacion = {
			id: id,
			leido: false,
			solicitudId: this.solicitud.id,
			texto: 'te ha asignado como Interventor de una solictud.',
			fecha: new Date(),
			actor: this.usuario.perfil.nombre
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

		const notificacionOficina: Notificacion = {
			id: id3,
			leido: false,
			solicitudId: this.solicitud.id,
			texto: 'Es tu hora de intervenir en el proceso de la solicitud',
			fecha: new Date()
		};
		this.notificacionService.notifyPlaneacion(notificacionAvance);
		this.notificacionService.notifyUsuarioWithId(notificacionAsignacion, this.interventorId);
		this.notificacionService.notifyOficinaContratacion(notificacionOficina);
		if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
			this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
		}
	}

	/**
	 * Método para general las variables a guardar en camunda.
	 */
	generateVariablesFromFormFields() {
		const variables = {
			variables: {
				interventorId: null
			}
		};
		variables.variables.interventorId = {
			value: this.interventorId
		};
		return variables;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea ya fue realizada.
	 * @param variables variables que vienen de camunda
	 */
	getVariables2(variables): void {
		for (const variable of variables) {
			if (variable.name == 'interventorId') {
				this.interventorId = variable.value;
			}
		}
		this.cargando = false;
	}
}
