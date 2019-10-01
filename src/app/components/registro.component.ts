import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Models
import { Unidad } from '../models/unidad';
import { Perfil } from '../models/perfil';
import { Usuario } from '../models/usuario';
import { AreaTecnica } from '../models/areaTecnica';

// Services
import { PerfilService } from '../services/perfil.service';
import { UnidadService } from '../services/unidad.service';
import { AreaTecnicaService } from '../services/areaTecnica.service';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-registro',
	templateUrl: '../views/registro.component.html',
	styleUrls: ['../../assets/css/login.css'],
	providers: [UnidadService, PerfilService, AreaTecnicaService, AuthService]
})

export class RegistroComponent implements OnInit {

	public perfiles: Perfil[] = [];
	public unidades: Unidad[];
	public areasTecnicas: AreaTecnica[];
	public usuario: Usuario;
	
	constructor(private router: Router, 
     	        private unidadService: UnidadService,
			  	private perfilService: PerfilService,
			  	private areaTecnicaService: AreaTecnicaService,
			    private usuarioService: UsuarioService,
			    private authService: AuthService) { }

  ngOnInit() {
    console.log('registro.component.ts cargado...');
		this.usuario = {
      nombres: '',
			correo: '',
			password: '',
			foto: '',
			perfil: null,
			unidad_id: null,
			area_id: null,
			estado: 'Pendiente',
			};
		this.getPerfiles();
		this.getUnidades();
		this.getAreasTecnicas();
		}

	onSubmit(form: NgForm) {
		if (form.invalid) { return; }
		this.validarUsuario();
		
		Swal.fire({
			allowOutsideClick: false,
			type: 'info',
			text: 'Espere por favor...'
		});

		Swal.showLoading(); // Iniciamos el loading.

		this.authService.nuevoUsuario(this.usuario) // Metodo para guardar en firebase auth al usuario.
			.then((resp) => {
				this.guardarUsuario(); // Guardamos el usuario en la base de datos firebase.
				this.modificarUsuario(); // Le modificamos el nombre y la foto al usuario recien creado. 
				Swal.close(); // Cerramos el loading
				this.registroMensaje('sucess'); // Mostramos un mensaje de exito para indicarle al usuario que se creó el usuario correctamente.	
			}).catch(err => {
				this.registroMensaje(err.code);
			});
		
		} // end onSubmit

  	// Metodo para mostrar un mensaje si el usuario se registro correctamente o no.
	registroMensaje(code: string) {
		if (code == 'sucess') {
			Swal.fire({
				allowOutsideClick: false,
				type: 'success',
				title: 'Registro Exitoso',
				text: 'Su cuenta se ha registrado con éxito. Por favor Inicie Sesión'
			});
		} else if (code == 'auth/email-already-in-use') {
			Swal.fire({
				allowOutsideClick: false,
				type: 'error',
				title: 'Error al registrar',
				text: 'El correo ya esta en uso. Por favor intente con un correo diferente o inicie sesión.'
			});
		}
	}

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

	// Metodo para guardar en firebase la informacion del usuario registrado haciendo uso del servicio.
	guardarUsuario() {
		this.usuarioService.crearUsuario(this.usuario)
					.then(() => { 
						console.log('Usuario agregado');
						this.authService.logout(); })
					.catch((err) => { console.log('ERROR AL GUARDAR', err); });
		}

	// Metodo para verificar que cada usuario tenga la informaciòn adecuada.
    // EJ: Si se registra un usuario con el perfil solicitante, que no vaya a tener 
    // asignado el atributo area_id porque un solicitante no pertenece a ningun area tecnica
	validarUsuario() {
      if (this.usuario.perfil == 'Solicitante') { delete this.usuario.area_id; } 
      else if (this.usuario.perfil == 'UAA Asesora') { delete this.usuario.unidad_id; }
      else {
        delete this.usuario.area_id; delete this.usuario.unidad_id; } // Si no es ni un solicitante ni una UAA Asesora, elimino las propiedades area_id y unidad_id
		}

	// Metodo para modificarle al usuario registrado las propiedades de nombre y foto. 
	// El usuario tendrá una foto por defecto que se encuentra almacenada en Firebase
	modificarUsuario(){
		this.authService.estaAutenticado().subscribe( user => {
			if (user) {
				user.updateProfile({
					displayName: this.usuario.nombres,
					photoURL: 'https://firebasestorage.googleapis.com/v0/b/campusgis-f9154.appspot.com/o/img%2Fperfil.png?alt=media&token=fbb69c8f-c256-4851-9749-d93269cf6596'
				}).then( () => { console.log('User Update');
				}).catch( (error) => console.log('error', error));
			}
		});
	}
}
