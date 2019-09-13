import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

//Models
import { Usuario } from '../models/usuario';

//services
//import { HeroesService } from '../../services/heroes.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: '../views/usuarios.html',
  providers: []
})
export class UsuariosComponent implements OnInit {


  usuarios: Usuario[] = [];
  cargando = false;


  constructor() { }

  ngOnInit() {

    //this.cargando = true;
    /* this.heroesService.getHeroes()
      .subscribe( resp => {
        this.heroes = resp;
        this.cargando = false;
      }); */

  }

  cambiarEstado(usuario: Usuario, estado: string){

  }

  borrarUsuario( usuario: Usuario, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ usuario.usuario_nombres }`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        this.usuarios.splice(i, 1);
        //this.heroesService.borrarHeroe( heroe.id ).subscribe();
      }

    });
  }


}
