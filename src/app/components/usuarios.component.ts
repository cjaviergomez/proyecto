import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

// Iconos
import { faSearchPlus, faExclamation} from '@fortawesome/free-solid-svg-icons';

// Models
import { Usuario } from '../models/usuario';

// services
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: '../views/usuarios.html',
  providers: []
})
export class UsuariosComponent implements OnInit, OnDestroy {

  usuarios: Usuario[] = [];
  cargando = false;
  private subscripcion: Subscription;

  // Icons
  faSearchPlus = faSearchPlus; // Icono a implementar en el botón de borrar.
  faExclamation = faExclamation; // Icono de exclamación.

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  // Metodo para cambiar el estado de los usuarios
  cambiarEstado(usuario: Usuario, estado: string) {
    let estadoInfinitivo: string;
    if ( estado == 'Desactivado'){
      estadoInfinitivo = 'desactivar';
    } else {
      estadoInfinitivo = 'activar';
    }
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea ${estadoInfinitivo} a ${ usuario.nombres }`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        usuario.estado = estado;
        this.usuarioService.actualizarUsuario(usuario);
      }
    });
  }

  // Borra un usuario de la base de datos y del arreglo de usuarios.
  borrarUsuario(usuario: Usuario, i: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea eliminar a ${ usuario.nombres }`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.usuarios.splice(i, 1); // Borra al usuario del arreglo de usuarios
        this.usuarioService.borrarUsuario(usuario.id); // usa el servicio para borrar al usuario de Firebase
      }
    });
  }

  // Metodo para cargar los usuarios de firebase haciendo uso del servicio.
  cargarUsuarios() {
    this.cargando = true;
    this.subscripcion = this.usuarioService.getUsuarios()
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  // Called once, before the instance is destroyed.
	ngOnDestroy(): void {
		if(this.subscripcion){
			this.subscripcion.unsubscribe();
		}
	}

}
