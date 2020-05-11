import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'; // Iconos

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

// Modelos
import { Documento } from 'app/proceso/models/documento';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';

@Component({
	selector: 'app-revisar-informes',
	templateUrl: './revisar-informes.component.html',
	styleUrls: ['./revisar-informes.component.css']
})
export class revisarInformesComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	validos: boolean;
	faTimes = faTimes;
	faCheck = faCheck;

	documents: Documento[] = [];

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
	 * Metodo para completar la tarea.
	 * @param valor booleano pasar saber si acepto o no los documentos
	 */
	terminarTarea(valor: boolean): void {
		this.validos = valor;
		Swal.fire({
			title: '¿Estás seguro?',
			text: `¿Estás seguro que deseas continuar?`,
			type: 'question',
			showConfirmButton: true,
			showCancelButton: true
		}).then((resp) => {
			if (resp.value) {
				const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
				this.enviarNotificaciones();
				this.completeTask(variables);
			}
		});
	}

	/**
	 * Método para general las variables a guardar en camunda.
	 */
	generateVariablesFromFormFields() {
		const variables = {
			variables: {
				validos: null
			}
		};
		variables.variables.validos = {
			value: this.validos
		};
		return variables;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea aun NO se ha realizado
	 * @param variables variables que han sido guardas en camunda con anterioridad.
	 */
	getVariables(variables): void {
		for (const variable of variables) {
			if (variable.name == 'informeDocumentos') {
				this.documents = variable.value;
			}
		}
		this.cargando = false;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea ya se ha realizado
	 * @param variables variables que han sido guardas en camunda con anterioridad.
	 */
	getVariables2(variables): void {
		this.getVariables(variables);
	}
}
