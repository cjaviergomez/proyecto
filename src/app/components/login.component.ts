import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

//Para trabajar con los modals
import Swal from 'sweetalert2';

//Modelos
import { Usuario } from '../models/usuario';

//Servicios
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../../assets/css/login.css'],
  providers:[AuthService, UsuarioService]
})
export class LoginComponent implements OnInit {

  public usuario: Usuario;
  private isActive: boolean;

  constructor(private authService: AuthService,
              private usuarioService: UsuarioService,
              private router: Router) {
                this.isActive = false;
              }

  ngOnInit() {
    this.usuario = {
      nombres: '',
      correo: ''
    };
  }

  onSubmit(form: NgForm) {
    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.usuarioService.getUserEstado(this.usuario.correo).subscribe( user => {
      if (user.length > 0 && user[0].estado == 'Activado'){
        this.isActive = true;
      }
    });

    this.authService.login( this.usuario )
          .then( resp => {
            Swal.close();
            if(this.isActive == true){
              this.router.navigateByUrl('/map');
            } else {
              this.authService.logout();
              this.errorLogin('noActive');
            }
          }).catch( err => {
            this.errorLogin(err.code);
          });
  }

  errorLogin(code: string): void{
    if(code == 'auth/user-not-found'){
      Swal.fire({
        type: 'error',
        title: 'Error al autenticar',
        text: 'Correo no registrado. Por favor verifique que el correo sea el correcto o registrese.'
      });
    } else if(code == 'auth/wrong-password'){
      Swal.fire({
        type: 'error',
        title: 'Error al autenticar',
        text: 'Contraseña incorrecta. Intentelo de nuevo.'
      });
    } else if(code == 'noActive'){
      Swal.fire({
        type: 'error',
        title: 'Cuenta no activa',
        text: 'Por favor espere a que su cuenta sea activada por un administrador'
      });
    }
  }
}
