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

@Component({
	selector: 'app-perfiles',
	templateUrl: './perfiles.component.html',
	styleUrls: ['./perfiles.component.css'],
})
export class PerfilesComponent implements OnInit, OnDestroy {
	//Iconos
	faPlus = faPlus;
	faPen = faPen;
	faSyncAlt = faSyncAlt;
	faExclamation = faExclamation;
	faTrash = faTrash;

	cargarPerfiles = true;
	public perfiles: Perfil[] = [];
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	constructor(private perfilService: PerfilService) {}

	ngOnInit(): void {
		this.getPerfiles();
	}

	getPerfiles(): void {
		this.perfilService
			.getPerfiles()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((perfiles) => {
				this.cargarPerfiles = false;
				this.perfiles = perfiles;
			});
	}

	borrarPerfil(perfil: Perfil, i: number): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Está seguro que desea borrar a ${perfil.nombre}`,
			type: 'question',
			showConfirmButton: true,
			showCancelButton: true,
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
