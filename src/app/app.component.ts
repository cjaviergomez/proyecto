import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Servicios
import { AuthService } from './services/auth.service';
import { UsuarioService } from './services/usuario.service';

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
  public isVerificador: any = null;
  usuario: Usuario = {
    nombres: '',
    correo: '',
    photoUrl: '',
    perfil: {
      nombre: ''
    }
  };

  constructor(private auth: AuthService,
              private usuarioService: UsuarioService,
              private router: Router){}

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
        // Se obtienen los valores de la sesion de firebase.
        this.usuario.nombres = user.displayName;
        this.usuario.correo = user.email;
        this.usuario.photoUrl = user.photoURL;

        this.auth.isUserAdmin(user.uid).subscribe(userRole => {
          if(userRole){
            this.isVerificador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('verificador');
          }
        });

        this.usuarioService.getUsuario(user.uid).subscribe((usuario: Usuario) => {
          // Obtenemos el nombre del perfil del usuario de la base de datos de firebase.
          this.usuario.perfil.nombre = usuario.perfil.nombre;
        });

      } else {
        this.islogged = false;
      }
    });
  }

}
