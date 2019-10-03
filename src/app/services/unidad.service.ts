import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Unidad } from '../models/unidad';

@Injectable({
	providedIn: 'root'
})
export class UnidadService {
	private unidadesCollection: AngularFirestoreCollection<Unidad>;
	private unidades: Observable<Unidad[]>


	constructor(private afs: AngularFirestore) {
		this.unidadesCollection = this.afs.collection<Unidad>('unidades');
		this.unidades = this.unidadesCollection.valueChanges();
	}

	// Metodo para obtener de la base de datos de firebase las unidades incluido su id.
	getUnidades() {
		return this.unidades = this.unidadesCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as Unidad;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
	}

}
