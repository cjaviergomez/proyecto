import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
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

  constructor(private afs: AngularFirestore) {}

  // No hace falta crear un metodo para crear usuarios en la base de datos.
  // El authService se encarga de guardar en la base de datos a los usuarios que se registren.

	// Metodo para obtener todos los usuarios registrados en la base de datos incluido su id.
	getUsuarios() {
    this.usuariosCollection = this.afs.collection<Usuario>('usuarios');
		return this.usuarios = this.usuariosCollection.snapshotChanges()
				.pipe(map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Usuario;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
  }

  // Metodo para obtener todos los usuarios de planeacion registrados en la base de datos incluido su id.
	getUsuariosPlaneacion() {
    this.usuariosCollection = this.afs.collection<Usuario>('usuarios', ref => ref.where('perfil.nombre', '==', 'Planeación'));
		return this.usuarios = this.usuariosCollection.snapshotChanges()
				.pipe(map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Usuario;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
  }

  // Metodo para obtener todos los usuarios de un area especifica registrados en la base de datos incluido su id.
	getUsuariosAreas(id:string) {
    this.usuariosCollection = this.afs.collection<Usuario>('usuarios', ref => ref.where('area_id', '==', id));
		return this.usuarios = this.usuariosCollection.snapshotChanges()
				.pipe(map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Usuario;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
  }

  // Metodo para obtener un usuario especifico de Firebase.
  getUsuario(id: string) {
    this.usuarioDoc = this.afs.doc<Usuario>(`usuarios/${id}`); // Ruta del usuario en particular.
    return this.usuario = this.usuarioDoc.snapshotChanges().pipe(map( action => {
      if(action.payload.exists == false) {
        return null;
      } else {
        const data = action.payload.data() as Usuario;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

	// Metodo para actualizar la informaciòn de un usuario en Firebase.
	updateUsuario(usuario: Usuario) {
		let idUsuario = usuario.id;
		delete usuario.id; // Le borramos el id al usuario para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados.
		this.usuarioDoc = this.afs.doc<Usuario>(`usuarios/${idUsuario}`);
		return this.usuarioDoc.update(usuario);
	 }

	// Metodo para borrar a un usuario de la base de datos de firebase.
	deleteUsuario(id: string): void {
		this.usuarioDoc = this.afs.doc<Usuario>(`usuarios/${id}`);
		this.usuarioDoc.delete();
	}

	// Este metodo se usa en el login y en usermanager para saber las propiedades del usuario que se está logueando.
	// Busca entre los usuario almacenados en firebase el que tenga el correo indicado.
  // Devuelve el observable que contiene la informaciòn del usuario.
  /**
   *
   * @param correo correo del usuario a identificar
   */
	getUserEstado(correo: string){
		this.usuariosCollection = this.afs.collection<Usuario>('usuarios', ref => ref.where('correo', '==', correo));
		return this.usuarios = this.usuariosCollection.snapshotChanges()
				.pipe(map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Usuario;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
	}

}
