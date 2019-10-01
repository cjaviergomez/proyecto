import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Perfil } from '../models/perfil';

@Injectable({
	providedIn: 'root'
})
export class PerfilService{
	private perfilesCollection: AngularFirestoreCollection<Perfil>;

	constructor(private afs: AngularFirestore) {
		this.perfilesCollection = this.afs.collection<Perfil>('perfiles', ref => ref.where('nombre', '>', 'Administrador'));
	}

	getPerfiles() {
		return this.perfilesCollection.valueChanges();
	}	

}
