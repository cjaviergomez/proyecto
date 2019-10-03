import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Modelos
import { Usuario } from '../models/usuario';

@Injectable({
	providedIn: 'root'
})
export class UsuarioService {
	
	private usuariosCollection: AngularFirestoreCollection<Usuario>;
	private usuarios: Observable<Usuario[]>;
	private usuarioDoc: AngularFirestoreDocument<Usuario>;
	private usuario: Observable<Usuario>;

	constructor(public http: HttpClient, private afs: AngularFirestore) {
		this.usuariosCollection = this.afs.collection<Usuario>('usuarios');
		this.usuarios = this.usuariosCollection.valueChanges();
	}

	// Metodo para crear un nuevo usuario en la base de datos de firebase.
	crearUsuario(usuario: Usuario){
		return this.usuariosCollection.add(usuario);
	}

	// Metodo para obtener todos los usuarios registrados en la base de datos incluido su id.
	getUsuarios() {
		return this.usuarios = this.usuariosCollection.snapshotChanges()
				.pipe(map( changes => {
					return changes.map( action => {
						const data = action.payload.doc.data() as Usuario;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
	}

	// TODO:Falta actualizar metodo. Implementar AngularFire2
	// Metodo para actualizar la informaciòn de un usuario en Firebase.
	actualizarUsuario(usuario: Usuario) {
		const usuarioTemp = {
			...usuario
		};
		delete usuarioTemp.id;
		return "this.http.put(`${ this.url }/usuarios/${ usuario.id }.json`, usuarioTemp)";
	 }

	// TODO: Falta actualizar metodo. Implementar AngularFire2
	borrarUsuario(id: string) {
		return "this.http.delete(`${ this.url }/usuarios/${ id }.json`)";
	}

	// Metodo para obtener un usuario especifico de Firebase.
	getUsuario(id: string) {
		this.usuarioDoc = this.afs.doc<Usuario>(`usuarios/${id}`); // Ruta del usuario en particular. 
		return this.usuario = this.usuarioDoc.snapshotChanges().pipe(map( action =>{
			if(action.payload.exists == false){
				return null;
			}else{
				const data = action.payload.data() as Usuario;
				data.id = action.payload.id;
				return data;
			}
		}));
	}

	// TODO: Falta actualizar metodo. Implementar AngularFire2
	// Metodo para saber si un usuario esta activo
	// Si el usuario esta activado returna true
	isActive(usuario: Usuario){
		return true;
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
