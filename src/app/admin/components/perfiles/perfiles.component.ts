import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Servicios
import { PerfilService } from '../../services/perfil.service';

// Modelos
import { Perfil } from 'app/admin/models/perfil';

// Iconos
import { faPlus, faPen, faSyncAlt, faExclamation, faTrash } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para visualizar todos los perfiles almacenados en la base de datos.
 */
@Component({
	selector: 'app-perfiles',
	templateUrl: './perfiles.component.html',
	styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit, OnDestroy {
	/** Icono para agregar un nuevo perfil */
	faPlus = faPlus;
	/** Icono del botón editar perfil */
	faPen = faPen;
	/** Icono que da vueltas mientras se carga la información de los perfiles */
	faSyncAlt = faSyncAlt;
	/** Icono de exclamación usado cuando no hay perfiles en la base de datos. */
	faExclamation = faExclamation;
	/** Icono usado en el botón eliminar */
	faTrash = faTrash;

	/** Variable para mostrar un mensaje de cargando mientras se obtienen los perfiles de la base de datos */
	cargarPerfiles = true;
	/** Variable para almacenar los perfiles obtenidos de la base de datos. */
	public perfiles: Perfil[] = [];
	/** Observable para desubscribir todos los observables. */
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	constructor(private perfilService: PerfilService) {}

	/**
	 * Este método forma parte del ciclo de vida del componente
	 * y es el primero en ejecutarse.
	 */
	ngOnInit(): void {
		this.getPerfiles();
	}

	/**
	 * Método para obtener todos los perfiles de la base de datos.
	 */
	getPerfiles(): void {
		this.perfilService
			.getPerfiles()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((perfiles) => {
				this.cargarPerfiles = false;
				this.perfiles = perfiles;
			});
	}

	/**
	 * Método para eliminar un perfil de la base de datos.
	 * @param perfil Perfil a eliminar.
	 * @param i index del perfil dentro del array.
	 */
	borrarPerfil(perfil: Perfil, i: number): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Está seguro que desea borrar a ${perfil.nombre}`,
			type: 'question',
			showConfirmButton: true,
			showCancelButton: true
		}).then((resp) => {
			if (resp.value) {
				this.perfilService.deletePerfil(perfil.id).then(() => {
					this.perfiles.splice(i, 1);
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
