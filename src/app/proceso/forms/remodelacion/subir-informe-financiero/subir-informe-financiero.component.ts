import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
declare let $: any; // Para trabajar con el modal

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

//Para subir los archivos
import { AngularFireStorage } from '@angular/fire/storage';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';

@Component({
	selector: 'app-subir-informe-financiero',
	templateUrl: './subir-informe-financiero.component.html',
	styleUrls: ['./subir-informe-financiero.component.css'],
})
export class subirInformeFinancieroComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	comentarios: string[] = [];

	//Para trabajar con el documento1
	uploadPercent: Observable<number>;
	urlDoc: Observable<string>;
	nameDocUp: string;

	constructor(
		route: ActivatedRoute,
		router: Router,
		camundaRestService: CamundaRestService,
		solicitudService: SolicitudService,
		swal: ShowMessagesService,
		usuarioService: UsuarioService,
		authService: AuthService,
		private storage: AngularFireStorage,
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
	 * Método para obtener toda la información del documento a cargar a Firestore
	 * @param e evento que se activa al seleccion un documento
	 */
	onUpload(e): void {
		const id = Math.random().toString(36).substring(2);
		const file = e.target.files[0];
		if (file) {
			this.nameDocUp = file.name;
			this.solicitud.nombreInformeFinanciero = this.nameDocUp;
		}
		const filePath = `docs/${this.solicitud.id}/informeFinanciero_${id}`;
		const ref = this.storage.ref(filePath);
		const task = this.storage.upload(filePath, file);
		this.uploadPercent = task.percentageChanges();
		task
			.snapshotChanges()
			.pipe(finalize(() => (this.urlDoc = ref.getDownloadURL())))
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe();
	}

	/**
	 * Metodo para actualizar la url del archivo de cotizacion
	 */
	subirArchivo(): void {
		this.swal.showQuestionMessage('').then((resp) => {
			if (resp.value) {
				this.swal.showLoading();
				this.urlDoc.pipe(takeUntil(this.ngUnsubscribe)).subscribe((url) => {
					this.solicitud.urlInformeFinanciero = url;
					this.solicitud.nombreInformeFinanciero = this.nameDocUp;
					this.solicitudService.updateSolicitud(this.solicitud);

					// Reiniciamos las variables.
					this.urlDoc = null;
					this.nameDocUp = null;

					this.swal.stopLoading();
				});
			}
		});
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea aun NO se ha realizado
	 * @param variables variables que han sido guardas en camunda con anterioridad.
	 */
	getVariables(variables): void {
		for (const variable of variables) {
			if (variable.name == 'comentarios') {
				this.comentarios = variable.value;
			}
		}
		this.cargando = false;
	}

	/**
	 * Método para abrir el modal con los comentarios
	 */
	abrirModal(): void {
		$('#verComentarios').modal('show');
	}

	/**
	 * Método para cerrar el modal
	 */
	cerrarModal(): void {
		$('#verComentarios').modal('hide');
	}
}
