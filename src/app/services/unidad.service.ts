import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Unidad } from '../models/unidad';

@Injectable({
	providedIn: 'root'
})
export class UnidadService {
	private unidadesCollection: AngularFirestoreCollection<Unidad>;


	constructor(private afs: AngularFirestore) {
		this.unidadesCollection = this.afs.collection<Unidad>('unidades');
	}

	// Metodo para obtener de la base de datos de firebase las unidades.
	getUnidades() {
		return this.unidadesCollection.valueChanges();
	}

}
