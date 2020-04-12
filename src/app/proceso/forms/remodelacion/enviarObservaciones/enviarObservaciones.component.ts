import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';

@Component({
	selector: 'app-enviar-observaciones',
	templateUrl: './enviarObservaciones.component.html',
	styleUrls: ['./enviarObservaciones.component.css'],
})
export class enviarObservacionesComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	observacionesP: string; //Propio de la tarea.

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
	 * Método para general las variables a guardar en camunda.
	 */
	generateVariablesFromFormFields() {
		const variables = {
			variables: {
				observacionesP: null,
			},
		};
		variables.variables.observacionesP = {
			value: this.observacionesP,
		};
		return variables;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea ya fue realizada.
	 * @param variables variables guardas en camunda
	 */
	getVariables2(variables): void {
		for (const variable of variables) {
			if (variable.name == 'observacionesP') {
				this.observacionesP = variable.value;
			}
		}
		this.cargando = false;
	}
}
