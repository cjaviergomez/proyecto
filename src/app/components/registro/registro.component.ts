import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

// Models
import { Unidad } from '../../models/unidad';
import { Perfil } from '../../models/perfil';
import { Usuario } from '../../models/usuario';
import { AreaTecnica } from '../../models/areaTecnica';

// Services
import { PerfilService } from '../../services/perfil.service';
import { UnidadService } from '../../services/unidad.service';
import { AreaTecnicaService } from '../../services/areaTecnica.service';
import { AuthService } from '../../services/auth.service';
import { ShowMessagesService } from '../../services/show-messages.service';

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['../login/login.component.css'],
	providers: [UnidadService, PerfilService, AreaTecnicaService, AuthService, ShowMessagesService]
})

export class RegistroComponent implements OnInit, OnDestroy {

	public perfiles: Perfil[] = [];
	public unidades: Unidad[];
	public areasTecnicas: AreaTecnica[];
	public usuario: Usuario = new Usuario();
	private subcripcion: Subscription;

	constructor(private unidadService: UnidadService,
              private perfilService: PerfilService,
              private areaTecnicaService: AreaTecnicaService,
              private swal: ShowMessagesService,
              private authService: AuthService) { }

  	ngOnInit() {
		this.usuario = {
			perfil: {
				id: null
			},
			unidad_id: null,
			area_id: null,
			estado: 'Pendiente',
			// Se crea al usuario con una foto por defecto, esta foto esta previamente almacenada en firebase Storage.
			photoUrl: 'https://firebasestorage.googleapis.com/v0/b/campusgis-f9154.appspot.com/o/img%2Fperfil.png?alt=media&token=fbb69c8f-c256-4851-9749-d93269cf6596'
			};
		this.getPerfiles();
		this.getUnidades();
		this.getAreasTecnicas();
	}

	onSubmit(form: NgForm) {
		if (form.invalid) { return; }

		this.swal.showLoading();
		this.perfilService.getPerfil(this.usuario.perfil.id).subscribe( resp => {
			this.usuario.perfil = resp;
			this.validarUsuario();
		});

		this.authService.nuevoUsuario(this.usuario) // Metodo para guardar en firebase auth al usuario.
			.then( resp => {
				this.modificarUsuario(); // Le modificamos el nombre y la foto al usuario recien creado.
        this.swal.stopLoading(); // Cerramos el loading
        this.swal.showSuccessMessage('createAccountSuccess'); // Mostramos un mensaje de exito para indicarle al usuario que se creó el usuario correctamente.
			}).catch(err => {
        this.swal.showErrorMessage(err.code);
			});

	} // end onSubmit

	// Metodo para obtener todas las Unidades academica administrativas usando el metodo getUnidades del servicio.
	getUnidades() {
    this.unidadService.getUnidades().subscribe(
		resp => {
			this.unidades = resp;
		});
	}

	// Metodo para obtener de la base de datos todos los perfiles haciendo uso del servicio
	getPerfiles() {
		this.perfilService.getPerfiles().subscribe(
			resp => {
				this.perfiles = resp;
			});
		}

	// Metodo para obtener de la base de datos todas las areas tecnicas haciendo uso del servicio
	getAreasTecnicas() {
		this.areaTecnicaService.getAreasTecnicas().subscribe(
			resp => {
				this.areasTecnicas = resp;
			});
		}

	// Metodo para verificar que cada usuario tenga la informaciòn adecuada.
    // EJ: Si se registra un usuario con el perfil solicitante, que no vaya a tener
    // asignado el atributo area_id porque un solicitante no pertenece a ningun area tecnica.
	validarUsuario() {
		// Si es solicitante
		if (this.usuario.perfil.nombre == 'Solicitante') { delete this.usuario.area_id; }
		// Si es UAA Asesora
      	else if (this.usuario.perfil.nombre == 'UAA Asesora') { delete this.usuario.unidad_id; }
      	else {
			delete this.usuario.area_id; delete this.usuario.unidad_id; } // Si no es ni un solicitante ni una UAA Asesora, elimino las propiedades area_id y unidad_id
		}

	// Metodo para modificarle al usuario registrado las propiedades de nombre y foto.
	// El usuario tendrá una foto por defecto que se encuentra almacenada en Firebase.
	modificarUsuario(){
		this.subcripcion = this.authService.estaAutenticado().subscribe( user => {
			if (user) {
				user.updateProfile({
					displayName: this.usuario.nombres,
					photoURL: 'https://firebasestorage.googleapis.com/v0/b/campusgis-f9154.appspot.com/o/img%2Fperfil.png?alt=media&token=fbb69c8f-c256-4851-9749-d93269cf6596'
				}).then( () => {
					this.authService.logout();
				}).catch( (error) => this.swal.showErrorMessage(error.code));
			}
		});

	}

	// Called once, before the instance is destroyed.
	ngOnDestroy(): void {
		if(this.subcripcion){
			this.subcripcion.unsubscribe();
		}
	}
}
