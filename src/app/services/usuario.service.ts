import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
		
	}

}
