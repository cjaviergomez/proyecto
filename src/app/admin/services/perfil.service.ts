import { Injectable } from '@angular/core';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Perfil } from '../models/perfil';

/**
 * Servicio para hacer el CRUD con respecto a los perfiles.
 */
@Injectable({
	providedIn: 'root'
})
export class PerfilService {
	private perfilesCollection: AngularFirestoreCollection<Perfil>;
	private perfiles: Observable<Perfil[]>;
	private perfilDoc: AngularFirestoreDocument<Perfil>;
	private perfil: Observable<Perfil>;

	constructor(private afs: AngularFirestore) {}

	/**
	 * Método para obtener todos los perfiles almacenados en la base de datos.
	 */
	getPerfiles() {
		this.perfilesCollection = this.afs.collection<Perfil>('perfiles', (ref) =>
			ref.where('nombre', '>', 'Administrador')
		);
		return (this.perfiles = this.perfilesCollection.snapshotChanges().pipe(
			map((changes) => {
				return changes.map((action) => {
					const data = action.payload.doc.data() as Perfil;
					data.id = action.payload.doc.id;
					return data;
				});
			})
		));
	}

	/**
	 * Metodo para agregar un perfil a la base de datos
	 * @param perfil perfil a añadir a la base de datos.
	 */
	addPerfil(perfil: Perfil) {
		this.perfilesCollection = this.afs.collection<Perfil>('perfiles');
		return this.perfilesCollection.add({
			nombre: perfil.nombre,
			roles: perfil.roles,
			descripcion: perfil.descripcion
		});
	}

	/**
	 * Metodo para obtener un Perfil especifico de Firebase.
	 * @param id id del perfil a obtener.
	 */
	getPerfil(id: string): Observable<Perfil> {
		this.perfilDoc = this.afs.doc<Perfil>(`perfiles/${id}`); // Ruta del usuario en particular.
		return (this.perfil = this.perfilDoc.snapshotChanges().pipe(
			map((action) => {
				if (action.payload.exists == false) {
					return null;
				} else {
					const data = action.payload.data() as Perfil;
					data.id = action.payload.id;
					return data;
				}
			})
		));
	}

	/**
	 * Metodo para actualizar un perfil de usuario.
	 * @param perfil perfil a actualizar.
	 */
	updatePerfil(perfil: Perfil): Promise<void> {
		const idPerfil = perfil.id;
		delete perfil.id; // Le borramos el id para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados.
		this.perfilDoc = this.afs.doc<Perfil>(`perfiles/${idPerfil}`);
		return this.perfilDoc.update(perfil);
	}

	/**
	 * Metodo para borrar un perfil de la base de datos de firebase.
	 * @param id id del perfil a eliminar.
	 */
	deletePerfil(id: string) {
		this.perfilDoc = this.afs.doc<Perfil>(`perfiles/${id}`);
		return this.perfilDoc.delete();
	}
}
