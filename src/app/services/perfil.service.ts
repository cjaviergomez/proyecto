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

  // TODO: Falta implementar metodo.
  addPerfil(perfil: Perfil) {}

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

  // Por lógica de negocio no es necesario implementar los demás metodos del CRUD.
  // No se crean los metodos Update y Delete.

}
