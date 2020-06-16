import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

declare let $: any;

// Servicios
import { UnidadService } from '../../services/unidad.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

// Modelos
import { Unidad } from 'app/admin/models/unidad';

// Iconos
import { faPlus, faPen, faSyncAlt, faExclamation } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para la visualización, creación y actualización de las unidades academico y/o administrativas en la BD.
 */
@Component({
	selector: 'app-unidades',
	templateUrl: './unidades.component.html',
	styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit, OnDestroy {
	/** Icono del botón "Nuevo" */
	faPlus = faPlus;
	/** Icono del botón de editar */
	faPen = faPen;
	/** Icono que gira mientras se obtiene la información de la BD. */
	faSyncAlt = faSyncAlt;
	/** Icono de exclamación usado cuando no se encuentran datos en la BD. */
	faExclamation = faExclamation;

	/** Variable para almacenar la información de la nueva unidad */
	unidad = new Unidad();
	/** Variable  para almacenar la información de la unidad a editar */
	unidadT = new Unidad();
	/** Variable para mostrar un mensaje de cargando mientras se obtiene la información de la BD */
	cargarUnidades = true;
	/** Variable para almacenar la información de las todas las unidades obtenidas de la BD */
	public unidades: Unidad[];
	/** Observable para desubscribir todos los observables. */
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	constructor(private unidadService: UnidadService, private swal: ShowMessagesService) {}

	/**
	 * Este método forma parte del ciclo de vida del componente
	 * y es el primero en ejecutarse.
	 */
	ngOnInit(): void {
		this.getUnidades();
	}

	/**
	 * Método para obtener de la BD todas la unidades
	 */
	getUnidades(): void {
		this.unidadService
			.getUnidades()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((unidades) => {
				this.cargarUnidades = false;
				this.unidades = unidades;
			});
	}

	/**
	 * Método para guardar una nueva undad en la BD.
	 * @param form Formulario con la información de la nueva unidad.
	 */
	guardarUnidad(form: NgForm): void {
		if (form.invalid) {
			return;
		}
		$('#unidadModal').modal('hide');
		this.unidadService
			.addUnidad(this.unidad)
			.then(() => {
				form.resetForm();
			})
			.catch(() => {
				this.swal.showErrorMessage('');
			});
	}

	/**
	 * Método para cerrar el modal de crear una nueva unidad.
	 * @param form formulario a resetear.
	 */
	cerrarModal(form: NgForm): void {
		form.resetForm();
		$('#unidadModal').modal('hide');
	}

	/**
	 * Método para abrir el modal con la unidad a editar.
	 * @param unidad unidad a editar.
	 */
	abrirModal(unidad: Unidad): void {
		this.unidadT = unidad;
		$('#updateUnidadModal').modal('show');
	}

	/**
	 * Método para cerrar el modal de actualizar una unidad.
	 */
	cerrarModalUpdate(): void {
		$('#updateUnidadModal').modal('hide');
	}

	/**
	 * Método para actualizar la información de una unidad.
	 * @param form formulario con la información de la unidad a actualizar.
	 */
	actualizarUnidad(form: NgForm): void {
		if (form.invalid) {
			return;
		}
		$('#updateUnidadModal').modal('hide');
		this.unidadService
			.updateUnidad(this.unidadT)
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
