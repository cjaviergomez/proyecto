import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Reforma } from '../models/reforma';

@Injectable({
  providedIn: 'root'
})
export class ReformaService{
	private reformasCollection: AngularFirestoreCollection<Reforma>;
	private reformas: Observable<Reforma[]>

	constructor(private afs: AngularFirestore) {}

	getReformas() {
    this.reformasCollection = this.afs.collection<Reforma>('reformas');
		return this.reformas = this.reformasCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as Reforma;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
  }

  // TODO: Falta implementar metodo.
  addReforma( reforma: Reforma) {}

  // TODO: Falta implementar metodo.
  getReforma ( id: string) {}

  // TODO: Falta implementar metodo.
  updateReforma(reforma: Reforma): void {}

  // TODO: Falta implementar metodo.
  deleteReforma( id: string): void {}

}
