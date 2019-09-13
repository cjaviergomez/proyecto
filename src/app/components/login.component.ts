import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import { Usuario } from '../models/usuario';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../../assets/css/login.css']
})
export class LoginComponent implements OnInit {
  public usuario: Usuario;

  constructor(private _authService: AuthService,
              private router: Router) {
  this.usuario = new Usuario(null, null, null, null, null, null, null, 'Pendiente');
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

    this._authService.login( this.usuario )
      .subscribe( resp => {
        Swal.close();
        this.router.navigateByUrl('/map');

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
