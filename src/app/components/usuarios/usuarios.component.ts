import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Iconos
import { faSearchPlus, faExclamation} from '@fortawesome/free-solid-svg-icons';

// Models
import { Usuario } from '../../models/usuario';

// services
import { UsuarioService } from '../../services/usuario.service';
import { ShowMessagesService } from '../../services/show-messages.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  providers: [UsuarioService, ShowMessagesService]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  usuarios: Usuario[] = [];
  cargando = false;
  private ngUnsubscribe = new Subject();

  // Icons
  faSearchPlus = faSearchPlus; // Icono a implementar en el botón de borrar.
  faExclamation = faExclamation; // Icono de exclamación.

  constructor(private usuarioService: UsuarioService,
              private swal: ShowMessagesService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  // Metodo para cambiar el estado de los usuarios
  cambiarEstado(usuario: Usuario, estado: string) {
    this.swal.showQuestionMessage('disableUserAccount', usuario, estado).then(resp => {
      if (resp.value) {
        usuario.estado = estado;
        this.usuarioService.updateUsuario(usuario)
        .catch((error) => {
          this.swal.showErrorMessage('');
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
