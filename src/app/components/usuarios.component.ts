import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

//Models
import { Usuario } from '../models/usuario';

//services
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: '../views/usuarios.html',
  providers: []
})
export class UsuariosComponent implements OnInit {


  usuarios: Usuario[] = [];
  cargando = false;


  constructor(private _usuarioService: UsuarioService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  //Metodo para cambiar el estado de los usuarios
  cambiarEstado(usuario: Usuario, estado: string){
    usuario.estado = estado;
    this._usuarioService.actualizarUsuario( usuario ).subscribe();
  }

  //Borra un usuario de la base de datos y del arreglo de usuarios.
  borrarUsuario( usuario: Usuario, i: number ) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea eliminar a ${ usuario.nombres }`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        this.usuarios.splice(i, 1); //Borra al usuario del arreglo de usuarios
        this._usuarioService.borrarUsuario( usuario.id ).subscribe(); //usa el servicio para borrar al usuario de Firebase
      }

    });
  }

  //Metodo para cargar los usuarios de firebase haciendo uso del servicio.
  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.getUsuarios()
      .subscribe( (usuarios:Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

}
