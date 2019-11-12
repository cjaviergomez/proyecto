import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Iconos
import { faSearchPlus, faExclamation} from '@fortawesome/free-solid-svg-icons';

// Models
import { Usuario } from '../models/usuario';

// services
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: '../views/usuarios.html',
  providers: [UsuarioService]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  usuarios: Usuario[] = [];
  cargando = false;
  private ngUnsubscribe = new Subject();

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
        this.usuarioService.updateUsuario(usuario).catch((error) => {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error inesperado. Intentalo de nuevo.',
            type: 'error',
            showConfirmButton: true
          });
        });;
      }
    });
  }

  // Metodo para cargar los usuarios de firebase haciendo uso del servicio.
  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.getUsuarios().pipe(
      takeUntil(this.ngUnsubscribe)
      ).subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  // Called once, before the instance is destroyed.
	ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
	}

}
