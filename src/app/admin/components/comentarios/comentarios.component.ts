import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicios
import { MensajesService } from '../../services/mensajes.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

// Modelos
import { Mensaje } from '../../models/mensaje';

// Iconos
import { faTrash, faEye, faSyncAlt, faExclamation } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para visualizar los comentarios almacenados en la base de datos.
 */
@Component({
	selector: 'app-comentarios',
	templateUrl: './comentarios.component.html',
	styles: []
})
export class ComentariosComponent implements OnInit, OnDestroy {
	/**
	 * Icono para el botón de eliminar
	 */
	faTrash = faTrash;
	/**
	 * Icono para el botón de ver comentario.
	 */
	faEye = faEye;
	/**
	 * Icono que gira mientras carga la información.
	 */
	faSyncAlt = faSyncAlt;
	/**
	 * Icono de exclamación usado cuando no se encuentran comentarios en la base de datos
	 */
	faExclamation = faExclamation;

	/**
	 * Variable usada para mostrar mensaje de cargando mientras se obtienen los comentarios de la base de datos.
	 */
	cargarMensajes = true;
	/**
	 * Variable para almacenar todos los mensajes obtenidos de la base de datos.
	 */
	public mensajes: Mensaje[] = [];

	/**
	 * Observable para desubscribir todos los observables.
	 */
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	constructor(private mensajesService: MensajesService, private swal: ShowMessagesService) {}

	/**
	 * Este método forma parte del ciclo de vida del componente
	 * y es el primero en ejecutarse.
	 */
	ngOnInit(): void {
		this.getMensajes();
	}

	/**
	 * Método para obtener todos los mensajes de la base de datos.
	 */
	getMensajes(): void {
		this.mensajesService
			.getMensajes()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((mensajes) => {
				this.cargarMensajes = false;
				this.mensajes = mensajes;
			});
	}

	/**
	 * Método para eliminar un mensaje de la base de datos.
	 * @param id id del mensaje a eliminar.
	 */
	eliminarMensaje(id: string): void {
		this.swal.showQuestionMessage('deleteComment').then((resp) => {
			if (resp.value) {
				this.swal.showLoading();
				this.mensajesService.deleteMensaje(id).then(() => {
					this.swal.stopLoading();
				});
			}
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
