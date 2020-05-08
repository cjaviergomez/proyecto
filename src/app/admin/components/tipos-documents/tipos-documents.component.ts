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

@Component({
	selector: 'app-tipos-documents',
	templateUrl: './tipos-documents.component.html',
	styleUrls: ['./tipos-documents.component.css']
})
export class TiposDocumentsComponent implements OnInit, OnDestroy {
	//Iconos
	faPlus = faPlus;
	faPen = faPen;
	faSyncAlt = faSyncAlt;
	faExclamation = faExclamation;

	documento = new Documento();
	documentoT = new Documento();
	cargarDocumentos = true;
	public documentos: Documento[];
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	constructor(private tipodocumentsService: TiposDocumentsService, private swal: ShowMessagesService) {}

	ngOnInit(): void {
		this.getDocumentos();
	}

	getDocumentos(): void {
		this.tipodocumentsService
			.getTiposDocuments()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((documentos) => {
				this.cargarDocumentos = false;
				this.documentos = documentos;
			});
	}

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

	cerrarModal(form: NgForm): void {
		form.resetForm();
		$('#documentoModal').modal('hide');
	}

	abrirModal(documento: Documento): void {
		this.documentoT = documento;
		$('#updateDocumentoModal').modal('show');
	}

	cerrarModalUpdate(form: NgForm): void {
		$('#updateDocumentoModal').modal('hide');
	}

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
