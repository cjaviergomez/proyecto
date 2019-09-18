import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario';

import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AuthService{
	private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
	private apiKey = 'AIzaSyA90CPjNruH8wUUZdoSgam4dkV3Dn2XAa0';

	userToken: string;

	constructor(private _http: HttpClient){
		this.leerToken();
	}

  //Crear nuevo usuario
	//https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  nuevoUsuario(usuario: Usuario){
    //let json = JSON.stringify(usuario);let params = 'json='+json;let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});return this._http.post(this.url+'register', params, {headers: headers});
		const authData = {
			email: usuario.correo,
			password: usuario.password,
			returnSecureToken: true
		};
		return this._http.post(
			`${this.url}signUp?key=${this.apiKey}`,
			authData
		).pipe(
      map( resp => {
        return resp;
      })
    );
	}

  //Metodo para 'cerrar la sesisión' de un usuario
	//Este metodo destruye el token del localStorage
  logout(){
		localStorage.removeItem('token');
  }

  //Loguear a un usuario
	//https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  login(usuario: Usuario){
		const authData = {
			email: usuario.correo,
			password: usuario.password,
			returnSecureToken: true
		};
		return this._http.post(
			`${this.url}signInWithPassword?key=${this.apiKey}`,
			authData
		).pipe(
      map( resp => {
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );
  }

	private guardarToken( idToken: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );

  }

	leerToken() {
		this.userToken = '';
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    }
    return this.userToken;

  }

	estaAutenticado(): boolean {
    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }
  }

}
