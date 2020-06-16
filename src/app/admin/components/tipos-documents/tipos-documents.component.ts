import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

declare let $: any;

// Servicios
import { ShowMessagesService } from '../../../out/services/show-messages.service';
import { TiposDocumentsService } from '../../services/tipos-documents.service';

// Modelos
import { Documento } from 'app/proceso/models/documento';

// Iconos
import { faPlus, faPen, faSyncAlt, faExclamation } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para visualizar, crear y modificar los diferentes tipos de documentos guardados en la BD.
 */
@Component({
	selector: 'app-tipos-documents',
	templateUrl: './tipos-documents.component.html',
	styleUrls: ['./tipos-documents.component.css']
})
export class TiposDocumentsComponent implements OnInit, OnDestroy {
	/** Icono del botón "Nuevo" */
	faPlus = faPlus;
	/** Icono del botón "Editar" */
	faPen = faPen;
	/** Icono que da vueltas mientras carga la información de la base de datos. */
	faSyncAlt = faSyncAlt;
	/** Icono de exclamación usado cuando no se encuentra ningún dato en la BD */
	faExclamation = faExclamation;

	/** Variable para almacenar la información del nuevo documento. */
	documento = new Documento();
	/** Variable para almacenar la información del tipo de documento a editar */
	documentoT = new Documento();
	/** Variable para mostrar un mensaje de cargando mientras se obtiene la información de la BD */
	cargarDocumentos = true;
	/** Variable para almacenar todos los documentos obtenidos de la BD */
	public documentos: Documento[];
	/** Observable para desubscribir todos los observables. */
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	constructor(private tipodocumentsService: TiposDocumentsService, private swal: ShowMessagesService) {}

	/**
	 * Este método forma parte del ciclo de vida del componente
	 * y es el primero en ejecutarse.
	 */
	ngOnInit(): void {
		this.getDocumentos();
	}

	/**
	 * Método para obtener de la BD todos los tipos de documentos
	 */
	getDocumentos(): void {
		this.tipodocumentsService
			.getTiposDocuments()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((documentos) => {
				this.cargarDocumentos = false;
				this.documentos = documentos;
			});
	}

	/**
	 * Método para guardar un nuevo documento en la BD.
	 * @param form Formulario con la información del nuevo tipo de documento.
	 */
	guardarDocumento(form: NgForm): void {
		if (form.invalid) {
			return;
		}

		$('#documentoModal').modal('hide');
		this.documento.id = Math.random().toString(36).substring(2);
		this.documento.label = this.documento.name;
		this.tipodocumentsService
			.addDocumento(this.documento)
			.then(() => {
				form.resetForm();
			})
			.catch(() => {
				this.swal.showErrorMessage('');
			});
	}

	/**
	 * Método para cerrar el modal de crear un nuevo tipo de documento.
	 * @param form formulario a resetear.
	 */
	cerrarModal(form: NgForm): void {
		form.resetForm();
		$('#documentoModal').modal('hide');
	}

	/**
	 * Método para abrir el moda con el tipo de documento a editar.
	 * @param documento tipo de documento a editar.
	 */
	abrirModal(documento: Documento): void {
		this.documentoT = documento;
		$('#updateDocumentoModal').modal('show');
	}

	/**
	 * Método para cerrar el modal de actualizar tipo de documento.
	 */
	cerrarModalUpdate(): void {
		$('#updateDocumentoModal').modal('hide');
	}

	/**
	 * Método para actualizar la información de un tipo de documento.
	 * @param form formulario con la información del tipo de documento a actualizar.
	 */
	actualizarDocumento(form: NgForm): void {
		if (form.invalid) {
			return;
		}
		$('#updateDocumentoModal').modal('hide');
		this.tipodocumentsService
			.updateDocumento(this.documentoT)
			.then(() => {
				this.swal.showSuccessMessage('');
			})
			.catch(() => {
				this.swal.showErrorMessage('');
			});
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
