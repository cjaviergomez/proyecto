import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Perfil } from '../models/perfil';

@Injectable({
	providedIn: 'root'
})
export class PerfilService{
	private perfilesCollection: AngularFirestoreCollection<Perfil>;
	private perfiles: Observable<Perfil[]>;
	private perfilDoc: AngularFirestoreDocument<Perfil>;
	private perfil: Observable<Perfil>;

	constructor(private afs: AngularFirestore) {}

	getPerfiles() {
    this.perfilesCollection = this.afs.collection<Perfil>('perfiles', ref => ref.where('nombre', '>', 'Administrador'));
		return this.perfiles = this.perfilesCollection.snapshotChanges()
				.pipe(map( changes => {
					return changes.map( action => {
						const data = action.payload.doc.data() as Perfil;
						data.id = action.payload.doc.id;
						return data;
			})
		}));
	}

  // Metodo para agregar un perfil a la base de datos
  addPerfil(perfil: Perfil) {
    this.perfilesCollection = this.afs.collection<Perfil>('perfiles');
    return this.perfilesCollection.add({nombre: perfil.nombre, roles: perfil.roles, descripcion: perfil.descripcion});
  }

	// Metodo para obtener un Perfil especifico de Firebase.
	getPerfil(id: string) {
		this.perfilDoc = this.afs.doc<Perfil>(`perfiles/${id}`); // Ruta del usuario en particular.
		return this.perfil = this.perfilDoc.snapshotChanges().pipe(map( action =>{
			if(action.payload.exists == false){
				return null;
			}else{
				const data = action.payload.data() as Perfil;
				data.id = action.payload.id;
				return data;
			}
		}));
  }

  //Metodo para actualizar un perfil de usuario.
  updatePerfil(perfil: Perfil) {
    let idPerfil = perfil.id;
		delete perfil.id; // Le borramos el id para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados.
		this.perfilDoc = this.afs.doc<Perfil>(`perfiles/${idPerfil}`);
		return this.perfilDoc.update(perfil);
  }

  // Metodo para borrar un perfil de la base de datos de firebase.
	deletePerfil(id: string) {
		this.perfilDoc = this.afs.doc<Perfil>(`perfiles/${id}`);
		return this.perfilDoc.delete();
  }

}
