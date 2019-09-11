import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario';

import { GLOBAL } from './global';

@Injectable()
export class AuthService{
	public url: string;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

  //Crear nuevo usuario
  registerUser(usuario: Usuario){
    let json = JSON.stringify(usuario);
		let params = 'json='+json;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(this.url+'register', params, {headers: headers});
  }

  //Metodo para cerrar la sesisiòn de un usuario
  logout(){

  }

  //Loguear a un usuario
  login(usuario: Usuario){

  }
}
