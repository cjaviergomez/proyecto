import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Iconos
import { faSearchPlus, faExclamation, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

// Models
import { Usuario } from '../../models/usuario';

// Services
import { UsuarioService } from '../../services/usuario.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

@Component({
	selector: 'app-usuarios',
	templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit, OnDestroy {
	usuarios: Usuario[] = [];
	cargando = false;
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	/** Icono a implementar en el botón de borrar. */
	faSearchPlus = faSearchPlus;
	/** Icono de exclamación. */
	faExclamation = faExclamation;
	/** Icono que da vueltas al cargar. */
	faSyncAlt = faSyncAlt;

	constructor(private usuarioService: UsuarioService, private swal: ShowMessagesService) {}

	/**
	 * Este método forma parte del ciclo de vida del componente
	 * y es el primero en ejecutarse.
	 */
	ngOnInit(): void {
		this.cargarUsuarios();
	}

	/**
	 * Metodo para cambiar el estado de los usuarios
	 * @param usuario Usuario a cambiarle el estado.
	 * @param estado Estado a insertar en el usuario.
	 */
	cambiarEstado(usuario: Usuario, estado: string): void {
		this.swal.showQuestionMessage('disableUserAccount', usuario, estado).then((resp) => {
			if (resp.value) {
				usuario.estado = estado;
				this.usuarioService.updateUsuario(usuario).catch((error) => {
					this.swal.showErrorMessage('');
				});
			}
		});
	}

	/**
	 * Metodo para cargar los usuarios de firebase haciendo uso del servicio.
	 */
	cargarUsuarios(): void {
		this.cargando = true;
		this.usuarioService
			.getUsuarios()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((usuarios: Usuario[]) => {
				this.usuarios = usuarios;
				this.cargando = false;
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
