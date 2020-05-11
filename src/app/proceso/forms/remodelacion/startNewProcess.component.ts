import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { takeUntil, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare let $: any; // Para trabajar con el modal
import { AngularFireStorage } from '@angular/fire/storage';

// Componentes
import { StartProcessInstanceComponent } from '../general/start-process-instance.component';

// Modelos
import { Material } from '../../models/material';
import { Documento } from 'app/proceso/models/documento';

// Servicios
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';
import { CamundaRestService } from '../../services/camunda-rest.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { MaterialesService } from 'app/proceso/services/materiales.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { NotificacionService } from '../../services/notificacion.service';
import { TiposDocumentsService } from '../../../admin/services/tipos-documents.service';

import {
	faWindowClose,
	faSearch,
	faPlus,
	faExclamation,
	faArrowCircleRight,
	faArrowCircleLeft,
	faSave,
	faSyncAlt,
	faTrashAlt
} from '@fortawesome/free-solid-svg-icons'; // Iconos

@Component({
	selector: 'startNewProcess',
	templateUrl: './startNewProcess.component.html',
	styleUrls: []
})
export class startNewProcessComponent extends StartProcessInstanceComponent implements OnInit, OnDestroy {
	material = new Material(); //Modelo del material a agregar a la base de datos.
	elementoPro = new Material(); //Modelo del elemento de protección a agregar a la base de datos.
	especial = new Material(); //Modelo de la accion especial a agregar a la base de datos.

	descripcionS = '';
	faWindowClose = faWindowClose;
	faSearch = faSearch;
	faPlus = faPlus;
	faExclamation = faExclamation;
	faArrowCircleRight = faArrowCircleRight; // Flecha del botón siguiente.
	faArrowCircleLeft = faArrowCircleLeft; // Flecha del botón atrás
	faSave = faSave;
	faSyncAlt = faSyncAlt;
	faTrashAlt = faTrashAlt;

	//Para trabajar con el documento a subir
	uploadPercent: Observable<number>;
	urlDoc: Observable<string>;
	nameDocUp: string;

	storage: AngularFireStorage;
	tiposdocumentosService: TiposDocumentsService;

	tiposDocuments: Documento[] = [];
	otroLabel: string; //Variable para asignarle el nombre al label en caso de que se seleccione otro documento

	constructor(
		route: ActivatedRoute,
		camundaRestService: CamundaRestService,
		authService: AuthService,
		usuarioService: UsuarioService,
		solicitudService: SolicitudService,
		unidadService: UnidadService,
		datePipe: DatePipe,
		materialService: MaterialesService,
		swal: ShowMessagesService,
		storage: AngularFireStorage,
		notificacionService: NotificacionService,
		tiposdocumentosService: TiposDocumentsService
	) {
		super(
			route,
			camundaRestService,
			authService,
			usuarioService,
			solicitudService,
			unidadService,
			datePipe,
			materialService,
			swal,
			notificacionService
		);
		this.storage = storage;
		this.tiposdocumentosService = tiposdocumentosService;
		this.tiposdocumentosService
			.getTiposDocuments()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((documentos) => {
				this.tiposDocuments = documentos;
			});
	}

	agregarDocumento(): void {
		this.document = new Documento();
		this.document.label = null;
		this.otroLabel = null;
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
			this.document.label = this.otroLabel;
		}
		this.documents.push(this.document);

		// Reiniciamos las variables.
		this.document = new Documento();
		form.resetForm();
		$('#addDocumento').modal('hide');
	}

	buscarMateriales(): void {
		if (this.filterPost.length === 0) {
			return;
		}
		this.swal.showLoading();
		this.materialService.getMaterial(this.filterPost).subscribe((materiales) => {
			this.swal.stopLoading();
			this.materiales = materiales;
			$('#buscarMaterial').modal('show');
		});
	}

	buscarElementos(): void {
		if (this.filterElements.length === 0) {
			return;
		}
		this.swal.showLoading();
		this.materialService.getElemento(this.filterElements).subscribe((elementos) => {
			this.swal.stopLoading();
			this.elementosPro = elementos;
			$('#buscarElementos').modal('show');
		});
	}

	buscarEspeciales(): void {
		if (this.filterEspecials.length === 0) {
			return;
		}
		this.swal.showLoading();
		this.materialService.getEspecial(this.filterEspecials).subscribe((especiales) => {
			this.swal.stopLoading();
			this.especiales = especiales;
			$('#buscarEspeciales').modal('show');
		});
	}

	guardarMaterial(form: NgForm, flat: string): void {
		if (form.invalid) {
			return;
		}
		this.swal.showLoading();

		if (flat === 'material') {
			$('#addMaterial').modal('hide');
			this.materialService
				.addMaterial(this.material)
				.then(() => {
					form.resetForm();
					this.swal.stopLoading();
				})
				.catch(() => {
					this.swal.stopLoading();
					this.swal.showErrorMessage('');
				});
		} else if (flat === 'elemento') {
			$('#addElemento').modal('hide');
			this.materialService
				.addElemento(this.elementoPro)
				.then(() => {
					form.resetForm();
					this.swal.stopLoading();
				})
				.catch(() => {
					this.swal.stopLoading();
					this.swal.showErrorMessage('');
				});
		} else if (flat === 'especial') {
			$('#addEspecial').modal('hide');
			this.materialService
				.addEspecial(this.especial)
				.then(() => {
					form.resetForm();
					this.swal.stopLoading();
				})
				.catch(() => {
					this.swal.stopLoading();
					this.swal.showErrorMessage('');
				});
		}
	}

	cerrarModalMaterial(form: NgForm, flat: string): void {
		form.resetForm();
		if (flat === 'elemento') {
			$('#addElemento').modal('hide');
		} else if (flat === 'material') {
			$('#addMaterial').modal('hide');
		} else if (flat === 'especial') {
			$('#addEspecial').modal('hide');
		}
	}

	nuevoMaterial(flat: string): void {
		if (flat === 'material') {
			$('#addMaterial').modal('show');
		} else if (flat === 'elemento') {
			$('#addElemento').modal('show');
		} else if (flat === 'especial') {
			$('#addEspecial').modal('show');
		}
	}

	addMaterial(elemento: Material, flat: string): void {
		if (flat === 'materiales') {
			this.materialesUsuario.push(elemento);
		} else if (flat === 'elementos') {
			this.elementosUsuario.push(elemento);
		} else if (flat === 'especiales') {
			this.especialesUsuario.push(elemento);
		}
	}

	eliminarMaterial(index: number, flat: string): void {
		if (flat === 'material') {
			this.materialesUsuario.splice(index, 1);
		} else if (flat === 'elemento') {
			this.elementosUsuario.splice(index, 1);
		} else if (flat === 'especial') {
			this.especialesUsuario.splice(index, 1);
		}
	}

	/**
	 * Método para obtener toda la información del documento a cargar a Firestore
	 * @param e evento que se activa al seleccion un documento
	 */
	onUpload(e): void {
		const id = Math.random().toString(36).substring(2);
		const file = e.target.files[0];
		if (file) {
			this.document.name = file.name;
		}
		const filePath = `docs/solicitudes/${this.usuario.nombres}/${id}_${this.document.name}`;
		const ref = this.storage.ref(filePath);
		const task = this.storage.upload(filePath, file);
		this.uploadPercent = task.percentageChanges();
		task
			.snapshotChanges()
			.pipe(finalize(() => (this.urlDoc = ref.getDownloadURL())))
			.pipe()
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
					this.document.urldocument = url;
					this.swal.stopLoading();
				});
			}
		});
	}

	eliminarDocumento(index: number): void {
		this.documents.splice(index, 1);
	}
}
