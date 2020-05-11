import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
declare let $: any; // Para trabajar con el modal
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'; // Iconos
import Swal from 'sweetalert2';

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';
import { Documento } from 'app/proceso/models/documento';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';

@Component({
	selector: 'app-revision-informe-financiero',
	templateUrl: './revision-informe-financiero.component.html',
	styleUrls: ['./revision-informe-financiero.component.css']
})
export class revisionInformeFinancieroComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	valido: boolean;
	comentarios: string[] = [];
	comentario: string;

	//Para trabajar con los documentos enviados anteriormente.
	documents: Documento[];
	document: Documento;
	document2: Documento;

	faTimes = faTimes;
	faCheck = faCheck;

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
	 * Metodo para completar la tarea
	 */
	terminarTarea(valor: boolean): void {
		this.valido = valor;
		if (this.valido === true) {
			Swal.fire({
				title: '¿Está seguro?',
				text: `¿Está seguro que desea aceptar los datos y continuar?`,
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
		} else if (this.valido === false) {
			Swal.fire({
				title: '¿Está seguro?',
				text: `¿Está seguro que desea rechazar?`,
				type: 'question',
				showConfirmButton: true,
				showCancelButton: true
			}).then((resp) => {
				if (resp.value) {
					this.mostrarModal();
				}
			});
		}
	}

	/**
	 * Método para enviar los comentarios del motivo del rechazo.
	 * @param form formulario con los datos del comentario
	 */
	enviarComentario(form: NgForm): void {
		if (form.invalid) {
			return;
		}
		$('#addComentario').modal('hide');
		this.comentarios.push(this.comentario);
		form.resetForm();
		const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
		this.enviarNotificaciones();
		this.completeTask(variables);
	}

	/**
	 * Método para abrir el modal
	 */
	mostrarModal(): void {
		$('#addComentario').modal('show');
	}

	/**
	 * Método para cerrar el modal
	 */
	cerrarModal(form: NgForm): void {
		form.resetForm();
		$('#addComentario').modal('hide');
	}

	/**
	 * Método para generar las variables a guardar en camunda.
	 */
	generateVariablesFromFormFields() {
		const variables = {
			variables: {
				valido: null,
				comentarios: null
			}
		};
		variables.variables.valido = {
			value: this.valido
		};
		variables.variables.comentarios = {
			value: this.comentarios
		};

		return variables;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea aun NO se ha realizado
	 * @param variables variables que han sido guardas en camunda con anterioridad.
	 */
	getVariables(variables): void {
		for (const variable of variables) {
			if (variable.name == 'comentarios') {
				this.comentarios = variable.value;
			} else if (variable.name == 'informeDocumentos') {
				this.documents = variable.value;
			}
		}
		if (this.documents.length > 0) {
			this.documents.forEach((documento) => {
				if (documento.id === 'evaluacion') {
					this.document = documento;
				} else if (documento.id === 'CDP') {
					this.document2 = documento;
				}
			});
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
