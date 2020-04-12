/* eslint-disable @typescript-eslint/class-name-casing */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

// Modelos
import { Notificacion } from 'app/in/models/notificacion';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';

@Component({
	selector: 'app-agregar-comentarios',
	templateUrl: './agregar-comentarios.component.html',
	styleUrls: ['./agregar-comentarios.component.css']
})
export class agregarComentariosComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	comentariosP: string;

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
	}

	/**
	 * Método para enviar la información de la tarea y terminarla.
	 */
	enviarComentarios(): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `¿Está seguro que desea enviar las observaciones?`,
			type: 'question',
			showConfirmButton: true,
			showCancelButton: true
		}).then((resp) => {
			if (resp.value) {
				this.solicitud.estado = 'Rechazada';
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
		this.notificacionService.notifyPlantaFisica(notificacionAvance);
		setTimeout(() => {
			this.notificacionService.notifyUsuario(notificacionEstado, this.solicitud.usuario);
		}, 1000);
		if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
			this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
		}
	}

	/**
	 * Método para generar las variables a guardar en Camunda.
	 */
	generateVariablesFromFormFields() {
		const variables = {
			variables: {
				comentariosP: null
			}
		};
		variables.variables.comentariosP = {
			value: this.comentariosP
		};
		return variables;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea ya fue realizada.
	 * @param variables variables guardas en camunda
	 */
	getVariables2(variables): void {
		for (const variable of variables) {
			if (variable.name == 'comentariosP') {
				this.comentariosP = variable.value;
			}
		}
		this.cargando = false;
	}
}
