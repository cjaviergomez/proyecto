import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { AreaTecnica } from '../models/areaTecnica';

@Injectable()
export class AreaTecnicaService {
	private areasTecnicasCollection: AngularFirestoreCollection<AreaTecnica>;

	constructor(private afs: AngularFirestore) {
		this.areasTecnicasCollection = this.afs.collection<AreaTecnica>('areasTecnicas');
	}

	getAreasTecnicas() {
		return this.areasTecnicasCollection.valueChanges();
	}

}
