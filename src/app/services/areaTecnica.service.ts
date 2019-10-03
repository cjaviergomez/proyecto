import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AreaTecnica } from '../models/areaTecnica';

@Injectable()
export class AreaTecnicaService {
	private areasTecnicasCollection: AngularFirestoreCollection<AreaTecnica>;
	private areasTecnicas: Observable<AreaTecnica[]>


	constructor(private afs: AngularFirestore) {
		this.areasTecnicasCollection = this.afs.collection<AreaTecnica>('areasTecnicas');
		this.areasTecnicas = this.areasTecnicasCollection.valueChanges();
	}

	// Metodo para obtener todas las areas tecnicas almacenadas en la base de datos de firebase incluido su id.
	getAreasTecnicas() {
		return this.areasTecnicas = this.areasTecnicasCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as AreaTecnica;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
	}

}
