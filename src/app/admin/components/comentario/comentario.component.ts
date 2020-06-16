import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Modelos
import { Mensaje } from '../../models/mensaje';

// Servicios
import { MensajesService } from '../../services/mensajes.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

// Iconos
import { faExclamation, faSyncAlt, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para visualizar un comentario en especifico obtenido de la base de datos.
 */
@Component({
	selector: 'app-comentario',
	templateUrl: './comentario.component.html',
	styleUrls: ['./comentario.component.css']
})
export class ComentarioComponent implements OnInit, OnDestroy {
	/**
	 * Variable para almacenar el comentario extraido de la base de datos.
	 */
	comentario: Mensaje;
	/**
	 * Variable para mostrar mensaje de cargando.
	 */
	cargando = false;

	/**
	 * Observable para desubscribir todos los observables.
	 */
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	/**
	 * Icono de exclamación.
	 */
	faExclamation = faExclamation;
	/**
	 * Icono que gira al cargar los datos.
	 */
	faSyncAlt = faSyncAlt;
	/**
	 * Icono de eliminar.
	 */
	faTrash = faTrash;
	/**
	 * Icono de regresar
	 */
	faArrowLeft = faArrowLeft;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private mensajeServices: MensajesService,
		private swal: ShowMessagesService
	) {}

	/**
	 * Este método forma parte del ciclo de vida del componente
	 * y es el primero en ejecutarse.
	 */
	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id'); // Se obtiene el id por la url

		this.cargando = true;
		this.mensajeServices
			.getMensaje(id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((mensaje: Mensaje) => {
				// Obtenemos el comentario de la base de datos de firebase.
				this.comentario = mensaje;
				this.cargando = false;
				// cambiamos el estado del comentario.
				this.updateComentario(this.comentario);
			});
	}

	/**
	 * Método para elimnar de la base de datos un comentario.
	 * @param id id del comentario a eliminar.
	 */
	eliminarMensaje(id: string): void {
		this.swal.showQuestionMessage('deleteComment').then((resp) => {
			if (resp.value) {
				this.swal.showLoading();
				this.mensajeServices.deleteMensaje(id).then(() => {
					this.swal.stopLoading();
					//Se redirije al componente comentarios.
					this.router.navigate(['/comentarios']);
				});
			}
		});
	}

	/**
	 * Método para actualizar el estado de un comentario.
	 * @param comentario Comentario a actualizar.
	 */
	updateComentario(comentario: Mensaje): void {
		if (comentario.estado === 'Pendiente') {
			comentario.estado = 'Leido';
			this.mensajeServices.updateMensaje(comentario);
		}
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
