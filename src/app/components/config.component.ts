import { Component, OnInit } from '@angular/core';

//Servicios
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';

// Models
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-config',
  templateUrl: '../views/config.html',
  styleUrls: ['../../assets/css/config.css'],
  providers: [UsuarioService, AuthService]
})
export class ConfigComponent implements OnInit {

  usuario: Usuario = new Usuario();
  cargando = false;
  seccion: number;

  constructor(private usuarioService: UsuarioService,
              private authService: AuthService){}

  ngOnInit() {
    this.seccion = 1;
    this.cargando = true;
    this.cargarUsuario();
  }


  cambiarSeccion(seccion: number) {
    this.seccion = seccion;
  }

  cargarUsuario(){
    this.authService.estaAutenticado().subscribe( user => {
      if(user){
        this.usuarioService.getUsuario(user.uid).subscribe((usuario: Usuario) => {
          // Obtenemos la información del usuario de la base de datos de firebase.
          this.usuario = usuario;
          this.cargando = false;

        });

      }
    });
  }
}
