import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//Servicios
import { UsuarioService } from '../../../admin/services/usuario.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { AreaTecnicaService } from '../../../admin/services/areaTecnica.service';
import { AuthService } from '../../../out/services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

// Models
import { Usuario } from '../../../admin/models/usuario';
import { AreaTecnica } from '../../../admin/models/areaTecnica';
import { Unidad } from 'app/admin/models/unidad';
import { Perfil } from 'app/admin/models/perfil';

// Iconos
import {
	faExclamation,
	faSave,
	faSmileWink,
	faDizzy,
	faGrinBeamSweat
} from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para editar el perfil de un usuario.
 */
@Component({
	selector: 'app-perfil-edit',
	templateUrl: './perfil-edit.component.html',
	styleUrls: ['./perfil-edit.component.css']
})
export class PerfilEditComponent implements OnInit, OnDestroy {
	/** Variable para almacenar la UAA del usuario al que se le va a modificar el perfil */
	public unidad: Unidad;
	/** Variable para almacenar el área técnica del usuario al que se le va a modificar el perfil */
	public areatecnica: AreaTecnica;
	/** Variable para almacenar todas las áreas tecnicas presentes en la base de datos */
	public areasTecnicas: AreaTecnica[];
	/** Variable para almacenar todos los perfiles presentes en la base de datos. */
	public perfiles: Perfil[] = [];
	/** Variable para almacenar todas las unidades presentes en la base de datos. */
	public unidades: Unidad[];
	/** Variable para almacenar la información del usuario al que se le va a modificar el perfil */
	usuario: Usuario;
	/** Variable para almacenar la información de usuario actual */
	usuarioLogin: Usuario;
	/** Variable para decidir si un usuario es o no verificador. */
	public isVerificador: any = null;
	/** Variable para mostrar un mensaje de cargando mientras se obtiene la información. */
	cargando = false;
	/** Observable para desubscribir todos los observables. */
	private ngUnsubscribe: Subject<any> = new Subject<any>(); // Observable para desubscribir todos los observables

	/**
	 * Icono de exclamación.
	 */
	faExclamation = faExclamation;
	/** Icono para el boton guardar */
	faSave = faSave;
	/** Icono para el boton de activado */
	faSmileWink = faSmileWink;
	/** Icono para el boton de desactivado */
	faDizzy = faDizzy;
	/** Icono para el boton de pendiente */
	faGrinBeamSweat = faGrinBeamSweat;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private swal: ShowMessagesService,
		private usuarioService: UsuarioService,
		private unidadService: UnidadService,
		private areaService: AreaTecnicaService,
		private perfilService: PerfilService,
		private auth: AuthService
	) {}

	/**
	 * Este método forma parte del ciclo de vida del componente
	 * y es el primero en ejecutarse.
	 */
	ngOnInit(): void {
		this.getCurrentUser();
		this.getPerfiles();
		this.getUnidades();
		this.getAreasTecnicas();
		const id = this.route.snapshot.paramMap.get('id'); // Se obtiene el id por la url

		this.cargando = true;
		this.usuarioService
			.getUsuario(id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((usuario: Usuario) => {
				// Obtenemos la informacion del usuario de la base de datos de firebase.
				this.usuario = usuario;
				this.cargando = false;
				if (usuario && usuario.unidad_id) {
					this.getUnidad();
				}
				if (usuario && usuario.area_id) {
					this.getAreaTecnica();
				}
			});
	}

	/**
	 * Método para saber si el usuario logeado tiene el rol verificador y pueda editar la información.
	 */
	getCurrentUser(): void {
		this.auth
			.estaAutenticado()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((user) => {
				if (user) {
					this.auth
						.isUserAdmin(user.uid)
						.pipe(takeUntil(this.ngUnsubscribe))
						.subscribe((userRole) => {
							if (userRole) {
								// eslint-disable-next-line no-prototype-builtins
								this.isVerificador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('verificador');
							}
						});
				}
			});
	}

	/**
	 * Método para obtener de la base de datos todos los perfiles haciendo uso del servicio
	 */
	getPerfiles(): void {
		this.perfilService
			.getPerfiles()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((resp) => {
				this.perfiles = resp;
			});
	}

	/**
	 * Metodo para obtener de la base de datos todas las areas tecnicas haciendo uso del servicio.
	 */
	getAreasTecnicas(): void {
		this.areaService
			.getAreasTecnicas()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((resp) => {
				this.areasTecnicas = resp;
			});
	}

	/**
	 * Metodo para obtener todas las Unidades academica administrativas usando el metodo getUnidades del servicio.
	 */
	getUnidades(): void {
		this.unidadService
			.getUnidades()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((resp) => {
				this.unidades = resp;
			});
	}

	/**
	 * Metodo para guardar o actualizar la información en la base de datos.
	 * @param form Formulario con la información del perfil.
	 */
	onSubmit(form: NgForm): void {
		if (form.invalid) {
			return;
		}
		this.swal.showLoading();
		for (const i in this.usuario.perfil.roles) {
			if (this.usuario.perfil.roles[i] === false) {
				delete this.usuario.perfil.roles[i];
			}
		}
		this.validarUsuario();
		this.usuarioService
			.updateUsuario(this.usuario)
			.then(() => {
				this.swal.stopLoading();
				this.swal.showSuccessMessage('');
			})
			.catch((error) => {
				this.swal.stopLoading();
				this.swal.showErrorMessage('');
			});
	}

	/**
	 * Método para obtener de la base de datos un unidad en especifico haciendo uso del servicio unidadService
	 */
	getUnidad(): void {
		this.unidadService
			.getUnidad(this.usuario.unidad_id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((unidad) => {
				// Se obtiene la información de la unidad desde la base de datos de firebase.
				this.unidad = unidad;
			});
	}

	/**
	 * Método para obtener una área tecnica de la base de datos haciendo uso del sercio areaService.
	 */
	getAreaTecnica(): void {
		this.areaService
			.getAreaTecnica(this.usuario.area_id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((areatecnica) => {
				// Se obtiene la información del area técnica desde la base de datos de firebase.
				this.areatecnica = areatecnica;
			});
	}

	/**
	 * Método obteener de la base de datos un perfil seleccionado.
	 * @param centroId id del perfil seleccionado.
	 */
	onChange(centroId: string): void {
		this.perfilService
			.getPerfil(centroId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((resp) => {
				this.usuario.perfil = resp;
			});
	}

	/**
   * Metodo para verificar que cada usuario tenga la informaciòn adecuada.
	EJ: Si se registra un usuario con el perfil solicitante, que no vaya a tener
  asignado el atributo area_id porque un solicitante no pertenece a ningun area tecnica.
   */
	validarUsuario(): void {
		// Si es solicitante
		if (this.usuario.perfil.nombre == 'Solicitante') {
			delete this.usuario.area_id;
		}
		// Si es UAA Asesora
		else if (this.usuario.perfil.nombre == 'UAA Asesora') {
			delete this.usuario.unidad_id;
		} else {
			// Si no es ni un solicitante ni una UAA Asesora, elimino las propiedades area_id y unidad_id
			delete this.usuario.area_id;
			delete this.usuario.unidad_id;
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
