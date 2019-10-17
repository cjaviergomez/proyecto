import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Servicios
import { AuthService } from './services/auth.service';

// Models
import { Usuario } from './models/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public title = 'CampusGIS';
  public islogged = false;
  usuario: Usuario = {
    nombres: '',
    correo: '',
    photoUrl: ''
  };

  constructor(private auth: AuthService, private router: Router){}

  ngOnInit() {
    this.getCurrentUser();
  }

  //Metodo para cerrar la sesiòn de un usuario haciendo uso del servicio
  salir(){
    this.auth.logout();
    this.router.navigate(['/login']);
    }

  // Metodo para saber si hay un usuario logeado actualmente.
  getCurrentUser(){
    this.auth.estaAutenticado().subscribe( user => {
      if(user){
        this.islogged = true;
        this.usuario.nombres = user.displayName;
        this.usuario.correo = user.email;
        this.usuario.photoUrl = user.photoURL;
      } else {
        this.islogged = false;
      }
    });
  }

}
