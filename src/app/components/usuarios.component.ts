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

    this.cargando = true;
    this._usuarioService.getUsuarios()
      .subscribe( resp => {
        this.usuarios = resp;
        this.cargando = false;
      });

  }

  cambiarEstado(usuario: Usuario, estado: string){

  }

  borrarUsuario( usuario: Usuario, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ usuario.nombres }`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        this.usuarios.splice(i, 1);
        this._usuarioService.borrarUsuario( usuario.id ).subscribe();
      }

    });
  }


}
