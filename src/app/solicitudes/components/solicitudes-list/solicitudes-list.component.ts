import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

// Iconos
import { faSearchPlus, faExclamation, faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

// Modelos
import { Solicitud } from '../../models/solicitud';
import { Usuario } from 'app/admin/models/usuario';

// Servicios
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../../out/services/auth.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

@Component({
	selector: 'solicitudes-list',
	templateUrl: './solicitudes-list.component.html',
	styleUrls: ['./solicitudes-list.component.css']
})
export class SolicitudesListComponent implements OnInit, OnDestroy {
	public titulo = 'Solicitudes';
	public solicitudes: Solicitud[];
	usuario: Usuario;
	cargando = false;
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	solicitudes$;

	// Icons
	faSearchPlus = faSearchPlus; // Icono a implementar en el botón de borrar.
	faExclamation = faExclamation; // Icono de exclamación.
	faSyncAlt = faSyncAlt; // Icono que da vueltas al cargar.
	faTrash = faTrash; // Icono del botón eliminar solicitud.

	constructor(
		private solicitudService: SolicitudService,
		private authService: AuthService,
		private usuarioService: UsuarioService,
		private swal: ShowMessagesService
	) {}

	ngOnInit(): void {
		this.getCurrentUser();
	}

	/**
	 * Método para obtener todas las solicitudes usando el metodo getSolicitudes del servicio.
	 */
	getSolicitudes(): void {
		this.cargando = true;
		this.solicitudes$ = this.solicitudService.getSolicitudes().pipe(
			map((solicitudes) => solicitudes.filter((solicitud) => solicitud.estado !== 'Finalizada')),
			takeUntil(this.ngUnsubscribe)
		);

		//Obtener las solicitudes del solicitante
		if (this.usuario.perfil.nombre === 'Solicitante') {
			console.log('Entró');
			this.solicitudes$ = this.solicitudes$.pipe(
				map((solicitudes: Solicitud[]) =>
					solicitudes.filter((solicitud) => solicitud.usuario.id === this.usuario.id)
				)
			);
			//Obtener las solicitudes del la oficina de contratación
		} else if (this.usuario.perfil.nombre === 'Oficina de Contratación') {
			this.solicitudes$ = this.solicitudes$.pipe(
				map((solicitudes: Solicitud[]) =>
					solicitudes.filter((solicitud) => solicitud.estado === 'En trámite')
				)
			);
			//Obtener las solicitudes del interventor
		} else if (this.usuario.perfil.nombre === 'Interventor') {
			this.solicitudes$ = this.solicitudes$.pipe(
				map((solicitudes: Solicitud[]) =>
					solicitudes.filter((solicitud) => solicitud.interventorId === this.usuario.id)
				)
			);
			//Obtener las solicitudes de la unidad asesora
		} else if (this.usuario.perfil.nombre === 'UAA Asesora') {
			this.solicitudes$ = this.solicitudes$.pipe(
				map((solicitudes: Solicitud[]) =>
					solicitudes.filter(
						(solicitud) => solicitud.dsiId === this.usuario.id || solicitud.mtId === this.usuario.id
					)
				)
			);
		}

		this.solicitudes$.subscribe((solicitudes) => {
			this.solicitudes = solicitudes;
			this.cargando = false;
		});
	}

	/**
	 * Metodo para saber si hay un usuario logeado actualmente y obtener su información.
	 */
	getCurrentUser(): void {
		this.authService
			.estaAutenticado()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((user) => {
				if (user) {
					this.usuarioService
						.getUsuario(user.uid)
						.pipe(takeUntil(this.ngUnsubscribe))
						.subscribe((usuario: Usuario) => {
							// Obtenemos la información del usuario de la base de datos de firebase.
							this.usuario = usuario;
							this.getSolicitudes();
						});
				}
			});
	}

	/**
	 * Método para eliminar una solicitud
	 * @param id id de la solicitud a eliminar
	 */
	onDeleteSolicitud(id: string): void {
		this.swal.showQuestionMessage('deleteComment').then((valor) => {
			if (valor.value) {
				this.swal.stopLoading();
				this.solicitudService.deleteSolicitud(id).then(() => {
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
