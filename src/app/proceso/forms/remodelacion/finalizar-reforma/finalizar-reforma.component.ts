import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { faUsers } from '@fortawesome/free-solid-svg-icons'; // Iconos
import Swal from 'sweetalert2';

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

// Modelos
import { Reforma } from 'app/reformas/models/reforma';
import { Notificacion } from 'app/in/models/notificacion';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { ReformaService } from '../../../../reformas/services/reforma.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';

@Component({
	selector: 'app-finalizar-reforma',
	templateUrl: './finalizar-reforma.component.html',
	styleUrls: ['./finalizar-reforma.component.css']
})
export class finalizarReformaComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	reforma: Reforma;
	faUsers = faUsers;
	fechaActual;
	datePipe: DatePipe;

	constructor(
		route: ActivatedRoute,
		router: Router,
		camundaRestService: CamundaRestService,
		solicitudService: SolicitudService,
		swal: ShowMessagesService,
		usuarioService: UsuarioService,
		authService: AuthService,
		datePipe: DatePipe,
		private reformaService: ReformaService,
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
		this.datePipe = datePipe;
	}

	/**
	 * Este método forma parte del ciclo de vida del componente y
	 * se ejecuta tan pronto se inicia el componente.
	 */
	ngOnInit(): void {
		this.metodoInicial();
		this.fechaActual = new Date();
		this.fechaActual = this.datePipe.transform(this.fechaActual, 'dd/MM/yyyy');
	}

	/**
	 * Método para enviar la información de la tarea y terminarla.
	 */
	completarTarea(): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `¿Está seguro que desea continuar?`,
			type: 'question',
			showConfirmButton: true,
			showCancelButton: true
		}).then((resp) => {
			if (resp.value) {
				this.swal.showLoading();
				this.solicitud.estado = 'Finalizada';

				this.solicitudService
					.updateSolicitud(this.solicitud)
					.then(() => {
						this.reforma = {
							nombre_edificio: this.solicitud.nombre_edificio,
							usuario: this.solicitud.usuario,
							descripcion: this.solicitud.descripcion,
							piso_edificio: this.solicitud.piso_edificio,
							fecha: this.fechaActual,
							objectID: this.solicitud.objectID,
							nombre_subcapa: this.solicitud.nombre_subcapa,
							idProccess: this.solicitud.idProcess
						};

						this.reformaService
							.addReforma(this.reforma)
							.then(() => {
								const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
								this.enviarNotificaciones();
								this.completeTask(variables);
								this.swal.stopLoading();
							})
							.catch((err) => {
								this.swal.stopLoading();
								this.swal.showErrorMessage('');
							});
					})
					.catch((err) => {
						this.swal.stopLoading();
						this.swal.showErrorMessage('');
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
		const notificacionAvance: Notificacion = {
			id: id,
			leido: false,
			solicitudId: this.solicitud.id,
			texto: 'Ha finalizado un proceso de una solicitud al cual estás vinculado.',
			fecha: new Date()
		};

		this.notificacionService.notifyPlantaFisica(notificacionAvance);
		if (this.solicitud.usuario.perfil.nombre !== 'Planta Física') {
			this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
		}
		if (this.interventorId) {
			this.notificacionService.notifyUsuarioWithId(notificacionAvance, this.interventorId);
		}
	}
}
