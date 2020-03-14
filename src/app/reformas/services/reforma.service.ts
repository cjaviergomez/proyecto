import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Reforma } from '../models/reforma';

@Injectable({
  providedIn: 'root'
})
export class ReformaService{
	private reformasCollection: AngularFirestoreCollection<Reforma>;
  private reformas: Observable<Reforma[]>
  private reformaDoc: AngularFirestoreDocument<Reforma>;
  private reforma: Observable<Reforma>;

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

  // Metodo para agregar a firebase una reforma.
  addReforma( reforma: Reforma) {
    this.reformasCollection = this.afs.collection<Reforma>('reformas');
    return this.reformasCollection.add({

      nombre_edificio: reforma.nombre_edificio,
      usuario: {
        ...reforma.usuario
      },
      descripcion: reforma.descripcion,
      piso_edificio: reforma.piso_edificio,
      fecha: reforma.fecha,
      objectID: reforma.objectID,
      nombre_subcapa: reforma.nombre_subcapa,
      idProccess: reforma.idProccess,
    });
  }

  // Metodo para obtener una reforma.
  getReforma ( id: string) {
    this.reformaDoc = this.afs.doc<Reforma>(`reformas/${id}`); // Ruta de la solicitud en particular en firebase.
    return this.reforma = this.reformaDoc.snapshotChanges().pipe(map( action => {
      if(action.payload.exists == false) {
        return null;
      } else {
        const data = action.payload.data() as Reforma;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

  // TODO: Falta implementar metodo.
  updateReforma(reforma: Reforma): void {}

  // TODO: Falta implementar metodo.
  deleteReforma( id: string): void {}

}
