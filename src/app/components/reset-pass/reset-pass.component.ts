import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Models
import { Usuario } from '../../models/usuario';

// Services
import { AuthService } from '../../services/auth.service';
import { ShowMessagesService } from '../../services/show-messages.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(private auth: AuthService,
              private swal: ShowMessagesService) { }

  ngOnInit() {
  }

  /**
   * Este método se usa para enviar el correo para reestablecer la contraseña.
   * @param form formulario con el correo a enviar la información para reiniciar la contraseña
   */
  onReset(form: NgForm) {
    if(!form.valid){return;}
    this.swal.showLoading();
    this.auth.resetPasswordInit(this.usuario.correo)
      .then(() => {
        this.swal.stopLoading();
        this.swal.showSuccessMessage('sendMailSuccess');
      }).catch(e =>{
        this.swal.stopLoading();
        this.swal.showErrorMessage(e.code);
      });
  }

}
