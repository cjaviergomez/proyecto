import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AreaTecnica } from '../models/areaTecnica';

@Injectable()
export class AreaTecnicaService {
	private areasTecnicasCollection: AngularFirestoreCollection<AreaTecnica>;
  private areasTecnicas: Observable<AreaTecnica[]>
  private areasTecnicasDoc: AngularFirestoreDocument<AreaTecnica>;
  private areaTecnica: Observable<AreaTecnica>;

	constructor(private afs: AngularFirestore) {}

	// Metodo para obtener todas las areas tecnicas almacenadas en la base de datos de firebase incluido su id.
	getAreasTecnicas() {
    this.areasTecnicasCollection = this.afs.collection<AreaTecnica>('areasTecnicas');
		return this.areasTecnicas = this.areasTecnicasCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as AreaTecnica;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
  }

  // TODO: Falta implementar metodo.
  addAreaTecnica(areaTecica: AreaTecnica) {}

  // Metodo para obtener un area tecnica especifica de Firebase.
	getAreaTecnica(id: string) {
		this.areasTecnicasDoc = this.afs.doc<AreaTecnica>(`areasTecnicas/${id}`); // Ruta del area en particular.
		return this.areaTecnica = this.areasTecnicasDoc.snapshotChanges().pipe(map( action =>{
			if(action.payload.exists == false){
				return null;
			} else {
				const data = action.payload.data() as AreaTecnica;
				data.id = action.payload.id;
				return data;
			}
		}));
  }

  // TODO: Falta implementar metodo.
  updateAreaTecnica(areaTecnica: AreaTecnica): void {}

  // TODO: Falta implementar metodo.
  deleteAreaTecnica(id: string): void {}

}
