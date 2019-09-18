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

	//Metodo para convertir en un arreglo de perfiles el json que extraigo de Firebase
	private crearArreglo( usuariosObj: object){

		const usuarios: Usuario[] = [];
		if(usuariosObj === null){ return []; }

		Object.keys( usuariosObj ).forEach( key => {

			const usuario: Usuario = usuariosObj[key];
			usuario.id = key;

			usuarios.push( usuario );
		});

		return usuarios;
	}

}
