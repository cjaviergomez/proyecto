import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';

import { Usuario } from '../models/usuario';

@Injectable({
	providedIn: 'root'
})
export class UsuarioService{
	private url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = "https://campusgis-f9154.firebaseio.com";
	}

  crearUsuario(usuario: Usuario){
    return this._http.post(`${ this.url }/usuarios.json`, usuario);
  }


  getUsuarios(){
		return this._http.get(`${this.url}/usuarios.json`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
	}

	actualizarUsuario( usuario: Usuario ) {
    const usuarioTemp = {
      ...usuario
    };

    delete usuarioTemp.id;
    return this._http.put(`${ this.url }/usuarios/${ usuario.id }.json`, usuarioTemp);

  }

	borrarUsuario( id: string ) {
		return this._http.delete(`${ this.url }/usuarios/${ id }.json`);
  }

	getUsuario( id: string ) {
		return this._http.get(`${ this.url }/usuarios/${ id }.json`);
  }

	//Metodo para saber si un usuario esta activo
	//Si el usuario esta activado returna true
	isActive(usuario: Usuario){
		return this._http.get(`${this.url}/usuarios.json`)
            .pipe(
              map( resp => this.buscarUsuario(resp, usuario.correo) ),
              delay(0)
            );
	}

	//Metodo para buscar un usuario que coincida con el correo y su estado sea activado
	private buscarUsuario( usuariosObj: object, correo: string){
		let active: boolean = false;

		if(usuariosObj === null){ return []; }

		Object.keys( usuariosObj ).forEach( key => {

			const usuario: Usuario = usuariosObj[key];
			usuario.id = key;
			if(usuario.correo == correo && usuario.estado == 'Activado'){
				active = true;
			}
		});

		return active;
	}

	//Metodo para convertir en un arreglo de usuarios el json que extraigo de Firebase
	private crearArreglo( usuariosObj: object){
		const usuarios: Usuario[] = [];

		if(usuariosObj === null){ return []; }

		Object.keys( usuariosObj ).forEach( key => {

			const usuario: Usuario = usuariosObj[key];
			usuario.id = key;
			if(usuario.id != 'ACCCC'){
				usuarios.push( usuario );
			}
		});

		return usuarios;
	}

}
