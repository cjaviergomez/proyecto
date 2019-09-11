import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../../assets/css/login.css']
})
export class LoginComponent implements OnInit {
  public usuario: Usuario;

  constructor() {
  this.usuario = new Usuario(null, null, null, null, null, null, null, 'Pendiente');
 }

  ngOnInit() {
  }

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }
    console.log("Formulario enviado");
    console.log(this.usuario);
    console.log(form);
  }

}
