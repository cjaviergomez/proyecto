import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Clase padre
import { ComunTaskComponent } from '../../general/comun-task.component';

// Modelos
import { Notificacion } from 'app/in/models/notificacion';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { AuthService } from '../../../../out/services/auth.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
	selector: 'app-revisar-solicitud',
	templateUrl: './revisarSolicitud.component.html',
	styleUrls: ['./revisarSolicitud.component.css'],
})
export class revisarSolicitudComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	//Notificaciones
	notificacionEstado: Notificacion;
	notificacionAvance: Notificacion;

	constructor(
		camundaRestService: CamundaRestService,
		route: ActivatedRoute,
		router: Router,
		authService: AuthService,
		usuarioService: UsuarioService,
		solicitudService: SolicitudService,
		swal: ShowMessagesService,
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

	ngOnInit(): void {
		this.metodoInicial();
	}

	/**
	 * Metodo para completar la tarea
	 * Esta tarea cambia el estado de la reforma a 'En trámite'.
	 */
	completarTarea(): void {
		this.swal.showLoading();
		this.solicitud.estado = 'En trámite';
		this.solicitudService
			.updateSolicitud(this.solicitud)
			.then(() => {
				this.enviarNotificaciones();
				this.completeTask({});
				this.swal.stopLoading();
			})
			.catch(() => {
				this.swal.stopLoading();
				this.swal.showErrorMessage('');
			});
	}

	/**
	 * Metodo para enviar las respectivas notificaciones a cada uno de los actores del proceso
	 * segùn la tarea.
	 */
	enviarNotificaciones(): void {
		//Notificar el cambio de estado y avance en el proceso.
		const id = Math.random().toString(36).substring(2);
		const id2 = Math.random().toString(36).substring(2);
		this.notificacionEstado = {
			id: id,
			leido: false,
			solicitudId: this.solicitud.id,
			texto: 'El estado de su solicitud ha cambiado.',
			fecha: new Date(),
		};

		this.notificacionAvance = {
			id: id2,
			leido: false,
			solicitudId: this.solicitud.id,
			texto: 'ha completado una tarea del proceso al cual estás vinculado.',
			actor: this.usuario.perfil.nombre,
			fecha: new Date(),
			task: this.task.name,
		};

		if (this.solicitud.usuario.perfil.nombre === 'Planta Física') {
			this.notificacionService.notifyUsuario(this.notificacionEstado, this.solicitud.usuario);
			setTimeout(() => {
				this.notificacionService.notifyPlantaFisica(this.notificacionAvance);
			}, 1000);
		} else {
			this.notificacionService.notifyUsuario(this.notificacionEstado, this.solicitud.usuario);
			this.notificacionService.notifyPlantaFisica(this.notificacionAvance);
			setTimeout(() => {
				this.notificacionService.notifyUsuario(this.notificacionAvance, this.solicitud.usuario);
			}, 1000);
		}
	}

	//Metodo para general las variables a guardar en camunda.
	generateVariablesFromFormFields() {
		const variables = {
			variables: {},
		};
		return variables;
	}
}
