import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
declare let $: any; // Para trabajar con el modal

import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Iconos

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
import { Documento } from 'app/proceso/models/documento';
import { TiposDocumentsService } from 'app/admin/services/tipos-documents.service';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-seguimiento-obra',
	templateUrl: './seguimiento-obra.component.html',
	styleUrls: ['./seguimiento-obra.component.css']
})
export class seguimientoObraComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	//Para trabajar con archivos extras a subir
	uploadPercentOtro: Observable<number>;
	urlDocOtro: Observable<string>;
	nameUpOtro: string;

	//Para trabajar con los documentos
	documentsSeguimientoObra: Documento[] = [];
	newDocumento: Documento = new Documento(); // Documento nuevo a agregar.
	tiposDocuments: Documento[] = [];
	otroLabel: string; //Variable para asignarle el nombre al label en caso de que se seleccione otro documento

	faPlus = faPlus;
	faTrash = faTrashAlt;

	//Para trabajar con la fecha de subida de los documentos.
	datePipe: DatePipe;
	fecha;

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
		private tiposdocumentosService: TiposDocumentsService,
		datePipe: DatePipe
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

		this.tiposdocumentosService
			.getTiposDocuments()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((documentos) => {
				this.tiposDocuments = documentos;
			});
		this.fecha = new Date();
		this.fecha = this.datePipe.transform(this.fecha, 'dd/MM/yyyy');
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
			if (variable.name == 'documentsSeguimientoObra') {
				this.documentsSeguimientoObra = variable.value;
			}
		}
		this.cargando = false;
	}

	/**
	 * Metodo para agregar las variables historicas al modelo cuando la tarea aun NO se ha realizado
	 * @param variables variables que han sido guardas en camunda con anterioridad.
	 */
	getVariables2(variables): void {
		this.getVariables(variables);
	}

	agregarDocumento(): void {
		this.newDocumento = new Documento();
		this.newDocumento.label = null;
		this.newDocumento.fechaUp = this.fecha;
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
		if (this.newDocumento.label === 'Otro') {
			this.newDocumento.label = this.otroLabel;
		}
		this.newDocumento.id = Math.random().toString(36).substring(2);
		this.documentsSeguimientoObra.push(this.newDocumento);

		const variables = this.generateVariablesFromFormFields2();

		// Usamos el servicio para actualizar la variable
		this.camundaRestService
			.updateVariables(
				this.procesoId,
				variables.variables.documentsSeguimientoObra,
				'documentsSeguimientoObra'
			)
			.subscribe((resp) => {
				// Reiniciamos las variables.
				this.newDocumento = new Documento();
				form.resetForm();
				$('#addDocumento').modal('hide');
			});
	}

	/**
	 * Método para generar las variables a guardar en Camunda.
	 */
	generateVariablesFromFormFields2() {
		const variables = {
			variables: {
				documentsSeguimientoObra: null
			}
		};

		variables.variables.documentsSeguimientoObra = {
			value: this.documentsSeguimientoObra
		};
		return variables;
	}

	eliminarDocumento(index: number): void {
		this.documentsSeguimientoObra.splice(index, 1);
		const variables = this.generateVariablesFromFormFields2();
		this.camundaRestService
			.updateVariables(
				this.procesoId,
				variables.variables.documentsSeguimientoObra,
				'documentsSeguimientoObra'
			)
			.subscribe();
	}
}
