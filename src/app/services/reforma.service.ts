import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Reforma } from '../models/reforma';

@Injectable()
export class ReformaService{
	private reformasCollection: AngularFirestoreCollection<Reforma>;
	private reformas: Observable<Reforma[]>

	constructor(private afs: AngularFirestore) {
		this.reformasCollection = this.afs.collection<Reforma>('reformas');
		this.reformas = this.reformasCollection.valueChanges();	
	}

	getReformas(){
		return this.reformas = this.reformasCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as Reforma;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
	}

}
