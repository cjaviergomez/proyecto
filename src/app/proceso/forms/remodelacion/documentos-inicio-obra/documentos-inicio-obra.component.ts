import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
declare let $: any; // Para trabajar con el modal

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Iconos

//Para subir los archivos
import { AngularFireStorage } from '@angular/fire/storage';

//Modelos
import { Documento } from 'app/proceso/models/documento';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';
import { TiposDocumentsService } from 'app/admin/services/tipos-documents.service';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-documentos-inicio-obra',
	templateUrl: './documentos-inicio-obra.component.html',
	styleUrls: ['./documentos-inicio-obra.component.css']
})
export class documentosInicioObraComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	// Datos a obtener de camunda.
	comentariosInicioObra: string[] = [];
	interventorId: string;

	//Para trabajar con el documento1
	uploadPercent: Observable<number>;
	urlDoc: Observable<string>;
	nameDocUp: string;

	//Para trabajar con archivos extras a subir
	uploadPercentOtro: Observable<number>;
	urlDocOtro: Observable<string>;
	nameUpOtro: string;

	//Para trabajar con los documentos
	documentsInicioObra: Documento[] = [];
	document: Documento = new Documento(); // Documento acta de inicio
	newDocumento: Documento = new Documento(); // Documento nuevo a agregar.
	tiposDocuments: Documento[] = [];
	otroLabel: string; //Variable para asignarle el nombre al label en caso de que se seleccione otro documento

	faPlus = faPlus;
	faTrash = faTrashAlt;

	constructor(
		route: ActivatedRoute,
		router: Router,
		camundaRestService: CamundaRestService,
		solicitudService: SolicitudService,
		swal: ShowMessagesService,
		usuarioService: UsuarioService,
		authService: AuthService,
		private storage: AngularFireStorage,
		notificacionService: NotificacionService,
		private tiposdocumentosService: TiposDocumentsService
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

		this.tiposdocumentosService
			.getTiposDocuments()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((documentos) => {
				this.tiposDocuments = documentos;
			});
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
			this.document.name = this.nameDocUp;
		}
		const filePath = `docs/${this.solicitud.id}/actaInicio_${id}${this.nameDocUp}`;
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
	 * Método para obtener toda la información del documento a cargar a Firestore
	 * @param e evento que se activa al seleccion un documento
	 */
	onUploadOtro(e): void {
		const id = Math.random().toString(36).substring(2);
		const file = e.target.files[0];
		if (file) {
			this.nameUpOtro = file.name;
			this.newDocumento.name = this.nameUpOtro;
		}
		const filePath = `docs/${this.solicitud.id}/${id}${this.nameUpOtro}`;
		const ref = this.storage.ref(filePath);
		const task = this.storage.upload(filePath, file);
		this.uploadPercentOtro = task.percentageChanges();
		task
			.snapshotChanges()
			.pipe(finalize(() => (this.urlDocOtro = ref.getDownloadURL())))
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe();
	}

	/**
	 * Metodo para actualizar la url del archivo de evaluación de cotizaciones
	 */
	subirArchivo(): void {
		this.swal.showQuestionMessage('').then((resp) => {
			if (resp.value) {
				this.swal.showLoading();
				this.urlDoc.pipe(takeUntil(this.ngUnsubscribe)).subscribe((url) => {
					this.document.urldocument = url;
					//Reiuniciamos las variables
					this.nameDocUp = null;
					this.swal.stopLoading();
				});
			}
		});
	}

	/**
	 * Metodo para actualizar la url del archivo de evaluación de cotizaciones
	 */
	subirArchivoOtro(): void {
		this.swal.showQuestionMessage('').then((resp) => {
			if (resp.value) {
				this.swal.showLoading();
				this.urlDocOtro.pipe(takeUntil(this.ngUnsubscribe)).subscribe((url) => {
					this.newDocumento.urldocument = url;
					//Reiuniciamos las variables
					this.nameUpOtro = null;
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
			if (variable.name == 'comentariosInicioObra') {
				this.comentariosInicioObra = variable.value;
			} else if (variable.name == 'interventorId') {
				this.interventorId = variable.value;
			} else if (variable.name == 'documentsInicioObra') {
				this.documentsInicioObra = variable.value;
			}
		}

		if (this.documentsInicioObra.length > 0) {
			this.documentsInicioObra.forEach((documento) => {
				if (documento.id === 'actaInicio') {
					this.document = documento;
				}
			});
		}
		if (!this.document.id) {
			this.document.id = 'actaInicio';
			this.document.label = 'Acta de Inicio';
		} else {
			this.documentsInicioObra.forEach((documento, index) => {
				if (documento.id === this.document.id) {
					this.documentsInicioObra.splice(index, 1);
				}
			});
		}
		this.cargando = false;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea ya fue realizada.
	 * @param variables variables guardas en camunda
	 */
	getVariables2(variables): void {
		this.getVariables(variables);
	}

	/**
	 * Método para abrir el modal
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

	agregarDocumento(): void {
		this.newDocumento = new Documento();
		this.newDocumento.label = null;
		$('#addDocumento').modal('show');
	}

	cerrarModalDocumento(form: NgForm): void {
		form.resetForm();
		$('#addDocumento').modal('hide');
	}

	guardarDocumento(form: NgForm): void {
		if (form.invalid) {
			return;
		}
		if (this.otroLabel) {
			this.newDocumento.label = this.otroLabel;
		}
		this.newDocumento.id = Math.random().toString(36).substring(2);
		this.documentsInicioObra.push(this.newDocumento);

		// Reiniciamos las variables.
		this.newDocumento = new Documento();
		form.resetForm();
		$('#addDocumento').modal('hide');
	}

	/**
	 * Método para generar las variables a guardar en Camunda.
	 */
	generateVariablesFromFormFields() {
		this.documentsInicioObra.push(this.document);
		const variables = {
			variables: {
				documentsInicioObra: null
			}
		};

		variables.variables.documentsInicioObra = {
			value: this.documentsInicioObra
		};
		return variables;
	}

	eliminarDocumento(index: number): void {
		this.documentsInicioObra.splice(index, 1);
	}
}
