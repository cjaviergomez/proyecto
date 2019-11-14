import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import Swal from 'sweetalert2';

// Services
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  onReset(form: NgForm) {
    if(!form.valid){return;}

    this.auth.resetPasswordInit(this.usuario.correo)
      .then(() => {
        Swal.fire({
          type: 'success',
          title: 'Correo enviado exitosamente',
          text: 'Por favor revisa tu correo'
        });

      }).catch(e => this.mensajeError(e.code));
  }

  mensajeError(mensaje: string) {
    switch( mensaje ){
      case 'auth/user-not-found': {
        Swal.fire({
          type: 'error',
          title: 'Correo no registrado',
          text: `No se ha encontrado ninguna cuenta asociada a ${this.usuario.correo}. `
        });
        break;
      }
      default: {
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error inesperado. Intentalo nuevamente'
        });
        break;
      }
    }
  }
}
