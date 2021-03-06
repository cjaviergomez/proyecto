import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

//Servicios
import { PerfilService } from '../../services/perfil.service';

//Models
import { Perfil } from '../../models/perfil';
import { Roles } from 'app/admin/models/roles';

// Iconos
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para visualizar o crear un nuevo perfil.
 */
@Component({
	selector: 'app-perfil-admin',
	templateUrl: './perfil-admin.component.html',
	styleUrls: ['./perfil-admin.component.css']
})
export class PerfilAdminComponent implements OnInit, OnDestroy {
	/**
	 * Variable que contiene la información del perfil a visualizar.
	 */
	perfil: Perfil = new Perfil();
	/**
	 * Observable para desubscribir todos los observables.
	 */
	private ngUnsubscribe: Subject<any> = new Subject<any>();
	/**
	 * Id del perfil a visualizar obtenido desde la url. Si se va a crear un nuevo perfil, este id será "nuevo"
	 */
	public id: string;

	/**
	 * Icono para el botón "guardar"
	 */
	faSave = faSave;
	/**
	 * Icono para el botón "Regresar"
	 */
	faArrowLeft = faArrowLeft;

	/** Variable para almacenar los roles */
	public roles: Roles = {
		verificador: false,
		observador_general: false,
		solucionador: false,
		modificador: false,
		agregador: false,
		creador: false,
		observador: false,
		interventor: false,
		gestor: false
	};

	constructor(private perfilService: PerfilService, private route: ActivatedRoute) {}

	/**
	 * Este método forma parte del ciclo de vida del componente
	 * y es el primero en ejecutarse.
	 */
	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id');

		if (this.id !== 'nuevo') {
			// Se obtiene el perfil asociado al id obtenido de la url
			this.perfilService
				.getPerfil(this.id)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe((resp: Perfil) => {
					this.perfil = resp;
					this.perfil.id = this.id;
					this.roles = this.perfil.roles;
				});
		}
	}

	/**
	 * Método para guardar en la base de datos un nuevo perfil.
	 * @param form formulario con la información del nuevo perfil
	 */
	guardar(form: NgForm): void {
		if (form.invalid) {
			return;
		}

		for (const i in this.roles) {
			if (this.roles[i] === false) {
				delete this.roles[i];
			}
		}

		this.perfil.roles = this.roles;

		Swal.fire({
			title: 'Espere',
			text: 'Guardando información',
			type: 'info',
			allowOutsideClick: false
		});
		Swal.showLoading();

		let peticion: Promise<any>;

		if (this.perfil.id) {
			peticion = this.perfilService.updatePerfil(this.perfil);
			peticion.then((resp) => {
				Swal.fire({
					title: this.perfil.nombre,
					text: 'Se actualizó correctamente',
					type: 'success'
				});
			});
		} else {
			peticion = this.perfilService.addPerfil(this.perfil);
			peticion.then((resp) => {
				Swal.fire({
					title: this.perfil.nombre,
					text: 'Se creó correctamente',
					type: 'success'
				});
			});
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
