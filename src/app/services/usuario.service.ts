import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

// Modelos
import { Usuario } from '../models/usuario';

@Injectable({
	providedIn: 'root'
})
export class UsuarioService {

	private url: string;
	private usuariosCollection: AngularFirestoreCollection<Usuario>;
	public usuarios: Usuario[] = [];

	constructor(public http: HttpClient, private afs: AngularFirestore) {
		this.url = 'https://campusgis-f9154.firebaseio.com';
		this.usuariosCollection = this.afs.collection<Usuario>('usuarios', ref => ref.where('perfil', '>', 'Administrador'));
	}

	// Metodo para crear un nuevo usuario en la base de datos de firebase.
	crearUsuario(usuario: Usuario){
		return this.usuariosCollection.add(usuario);
	}

	// Metodo para obtener todos los usuarios registrados en la base de datos.
	getUsuarios() {
		return this.usuariosCollection.valueChanges();
	}

	// TODO:Falta actualizar metodo. Implementar AngularFire2
	// Metodo para actualizar la informaciòn de un usuario en Firebase.
	actualizarUsuario(usuario: Usuario) {
		const usuarioTemp = {
			...usuario
		};
		delete usuarioTemp.id;
		return this.http.put(`${ this.url }/usuarios/${ usuario.id }.json`, usuarioTemp);
	 }

	// TODO: Falta actualizar metodo. Implementar AngularFire2
	borrarUsuario(id: string) {
		return this.http.delete(`${ this.url }/usuarios/${ id }.json`);
	}

	// TODO: Falta actualizar metodo. Implementar AngularFire2
	// Metodo para obtener un usuario de Firebase.
	getUsuario(id: string) {
		return this.http.get(`${ this.url }/usuarios/${ id }.json`);
	}

	// TODO: Falta actualizar metodo. Implementar AngularFire2
	// Metodo para saber si un usuario esta activo
	// Si el usuario esta activado returna true
	isActive(usuario: Usuario){
		return this.http.get(`${this.url}/usuarios.json`)
			.pipe(
				map(resp => this.buscarUsuario(resp, usuario.correo)),
				delay(0)
				);
	}

	// TODO: Falta actualizar metodo. Implementar AngularFire2
	// Metodo para buscar un usuario que coincida con el correo y su estado sea activado
	private buscarUsuario(usuariosObj: object, correo: string) {
		let active: boolean = false;

		if (usuariosObj === null) { return false; }

		Object.keys(usuariosObj).forEach(key => {

			const usuario: Usuario = usuariosObj[key];
			usuario.id = key;
			if(usuario.correo === correo && usuario.estado === 'Activado'){
				active = true;
			}
		});

		return active;
	}

}
