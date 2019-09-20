import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import { Usuario } from '../models/usuario';

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

  constructor(private _authService: AuthService,
              private _usuarioService: UsuarioService,
              private router: Router) {
  this.usuario = new Usuario();
 }

  ngOnInit() {

  }

  onSubmit(form: NgForm){
    if (  form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this._usuarioService.isActive(this.usuario)
      .subscribe( resp => {
        this.active = resp;
      });

    this._authService.login( this.usuario )
          .subscribe( resp => {
            Swal.close();
            if(this.active == false){
              this._authService.logout();
              this._authService.leerToken();
              Swal.fire({
                type: 'error',
                title: 'Cuenta no activa',
                text: 'Por favor espere a que su cuenta sea activada por un administrador'
              });

            }else{
              this.router.navigateByUrl('/map');
            }
          }, (err) => {
            console.log(err.error.error.message);
            Swal.fire({
              type: 'error',
              title: 'Error al autenticar',
              text: err.error.error.message
            });
          });

  }

}
