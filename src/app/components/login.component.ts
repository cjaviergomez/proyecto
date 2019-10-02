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
  styleUrls: ['../../assets/css/login.css']
})
export class LoginComponent implements OnInit {
  public usuario: Usuario;
  private active: boolean;

  constructor(private authService: AuthService,
              private usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit() {
    this.usuario = {
      nombres: '',
      correo: ''
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.usuarioService.isActive(this.usuario)
      .subscribe( resp => {
        this.active = resp;
      });

    this.authService.login( this.usuario )
          .then( resp => {
            console.log(resp); //TODO: Esta respuesta contiene la informacion del usuario, se puede utilizar para mostrar esa informacion. 
            Swal.close();
            if (this.active == false){
              this.authService.logout();
              this.errorLogin('noActive');
            } else {
              this.router.navigateByUrl('/map');
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
        text: 'Correo no resgistrado. Por favor verifique que el correo sea el correcto o registrese.'
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
