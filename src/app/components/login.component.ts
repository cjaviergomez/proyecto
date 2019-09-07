import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../../assets/css/login.css']
})
export class LoginComponent implements OnInit {
  public usuario: Usuario;

  constructor() {
  this.usuario = new Usuario(0, null, null, null, null, null, null);
 }

  ngOnInit() {
  }

  onSubmit(){
    console.log("Formulario enviado");
    console.log(this.usuario);
    console.log(this.usuario.correo);
    console.log(this.usuario.password);
  }

}
