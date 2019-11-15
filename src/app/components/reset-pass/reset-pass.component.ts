import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';

// Services
import { AuthService } from '../../services/auth.service';
import { ShowMessagesService } from '../../services/show-messages.service';
@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css'],
  providers: [AuthService, ShowMessagesService]
})
export class ResetPassComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(private auth: AuthService,
              private swal: ShowMessagesService) { }

  ngOnInit() {
  }

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
