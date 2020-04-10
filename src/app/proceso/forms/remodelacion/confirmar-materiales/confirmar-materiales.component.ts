import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunTaskComponent } from '../../general/comun-task.component';
import Swal from 'sweetalert2';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // Iconos

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
	selector: 'app-confirmar-materiales',
	templateUrl: './confirmar-materiales.component.html',
	styleUrls: ['./confirmar-materiales.component.css'],
})
export class confirmarMaterialesComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	faExclamationTriangle = faExclamationTriangle;
	interventorId: string;

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

	ngOnInit(): void {
		this.metodoInicial();
	}

	//Metodo para completar la tarea.
	completarTarea(): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `¿Está seguro que desea continuar?`,
			type: 'question',
			showConfirmButton: true,
			showCancelButton: true,
		}).then((resp) => {
			if (resp.value) {
				const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
				this.completeTask(variables);
			}
		});
	}

	//Metodo para general las variables a guardar en camunda.
	generateVariablesFromFormFields() {
		const variables = {
			variables: {},
		};
		return variables;
	}

	// Metodo para obtener las variables historicas que se van a usar.
	getVariables2(variables): void {
		this.cargando = false;
	}
}
