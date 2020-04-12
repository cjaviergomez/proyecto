import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
declare let $: any; // Para trabajar con el modal
import Swal from 'sweetalert2';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'; // Iconos

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';

@Component({
	selector: 'app-revisar-docs-reforma',
	templateUrl: './revisar-docs-reforma.component.html',
	styleUrls: ['./revisar-docs-reforma.component.css']
})
export class revisarDocsReformaComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	docsReforma: boolean;
	comentariosEntregaR: string[] = [];
	comentario: string;

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
	 * Metodo para completar la tarea.
	 * @param valor booleano pasar saber si acepto o no los documentos
	 */
	terminarTarea(valor: boolean): void {
		this.docsReforma = valor;
		if (this.docsReforma === true) {
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
		} else if (this.docsReforma === false) {
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
		this.comentariosEntregaR.push(this.comentario);
		form.resetForm();
		const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
		this.enviarNotificaciones();
		this.completeTask(variables);
	}

	/**
	 * Método para abrir el modal del comentario.
	 */
	mostrarModal(): void {
		$('#addComentario').modal('show');
	}

	/**
	 * Método para cerrar el modal del comentario.
	 * @param form formulario del comentario
	 */
	cerrarModal(form: NgForm): void {
		form.resetForm();
		$('#addComentario').modal('hide');
	}

	/**
	 * Metodo para general las variables a guardar en camunda.
	 */
	generateVariablesFromFormFields() {
		const variables = {
			variables: {
				docsReforma: null,
				comentariosEntregaR: null
			}
		};
		variables.variables.docsReforma = {
			value: this.docsReforma
		};
		variables.variables.comentariosEntregaR = {
			value: this.comentariosEntregaR
		};

		return variables;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea aun NO se ha realizado
	 * @param variables variables que han sido guardas en camunda con anterioridad.
	 */
	getVariables(variables): void {
		for (const variable of variables) {
			if (variable.name == 'comentariosEntregaR') {
				this.comentariosEntregaR = variable.value;
			} else if (variable.name == 'interventorId') {
				this.interventorId = variable.value;
			}
		}
		this.cargando = false;
	}
}
