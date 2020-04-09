import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunTaskArchivosComponent } from '../../general/comun-task-archivos.component';
import { NgForm } from '@angular/forms';
declare let $: any; // Para trabajar con el modal
import Swal from 'sweetalert2';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'; // Iconos

//Para subir los archivos
import { AngularFireStorage } from '@angular/fire/storage';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
	selector: 'app-verificar-documentos',
	templateUrl: './verificar-documentos.component.html',
	styleUrls: ['./verificar-documentos.component.css'],
})
export class verificarDocumentosComponent extends ComunTaskArchivosComponent implements OnInit, OnDestroy {
	docsInicioObra: boolean;
	comentariosInicioObra: string[] = [];
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
		storage: AngularFireStorage,
		notificacionService: NotificacionService
	) {
		super({
			route,
			router,
			camundaRestService,
			solicitudService,
			swal,
			usuarioService,
			authService,
			storage,
			notificacionService,
		});
	}

	ngOnInit(): void {
		this.metodoInicial();
	}

	//Metodo para completar la tarea.
	completarTarea(valor: boolean): void {
		this.docsInicioObra = valor;
		if (this.docsInicioObra === true) {
			Swal.fire({
				title: '¿Está seguro?',
				text: `¿Está seguro que desea aceptar los datos y continuar?`,
				type: 'question',
				showConfirmButton: true,
				showCancelButton: true,
			}).then((resp) => {
				if (resp.value) {
					const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
					this.completeTask(variables);
				}
			});
		} else if (this.docsInicioObra === false) {
			Swal.fire({
				title: '¿Está seguro?',
				text: `¿Está seguro que desea rechazar?`,
				type: 'question',
				showConfirmButton: true,
				showCancelButton: true,
			}).then((resp) => {
				if (resp.value) {
					this.mostrarModal();
				}
			});
		}
	}

	mostrarModal(): void {
		$('#addComentario').modal('show');
	}

	enviarComentario(form: NgForm): void {
		if (form.invalid) {
			return;
		}
		$('#addComentario').modal('hide');
		this.comentariosInicioObra.push(this.comentario);
		form.resetForm();
		const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
		this.completeTask(variables);
	}

	cerrarModal(form: NgForm): void {
		form.resetForm();
		$('#addComentario').modal('hide');
	}

	//Metodo para general las variables a guardar en camunda.
	generateVariablesFromFormFields() {
		const variables = {
			variables: {
				docsInicioObra: null,
				comentariosInicioObra: null,
			},
		};
		variables.variables.docsInicioObra = {
			value: this.docsInicioObra,
		};
		variables.variables.comentariosInicioObra = {
			value: this.comentariosInicioObra,
		};

		return variables;
	}

	getVariables(variables): void {
		for (const variable of variables) {
			if (variable.name == 'comentarios') {
				this.comentariosInicioObra = variable.value;
			}
		}
		this.cargando = false;
	}

	getVariables2(): void {
		this.cargando = false;
	}

	/**
	 * Este metodo se ejecuta cuando el componente se destruye
	 * Usamos este método para cancelar todos los observables.
	 */
	ngOnDestroy(): void {
		// End all subscriptions listening to ngUnsubscribe
		// to avoid memory leaks.
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
