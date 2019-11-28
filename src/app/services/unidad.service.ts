import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelos
import { Unidad } from '../models/unidad';

@Injectable({
	providedIn: 'root'
})
export class UnidadService {
	private unidadesCollection: AngularFirestoreCollection<Unidad>;
  private unidades: Observable<Unidad[]>
  private unidadDoc: AngularFirestoreDocument<Unidad>;
  private unidad: Observable<Unidad>;


	constructor(private afs: AngularFirestore) {}

	// Metodo para obtener de la base de datos de firebase las unidades incluido su id.
	getUnidades() {
    this.unidadesCollection = this.afs.collection<Unidad>('unidades');
		return this.unidades = this.unidadesCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as Unidad;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
  }

  // Método para agregar una unidad a la base de datos
  addUnidad( unidad: Unidad){
    this.unidadesCollection = this.afs.collection<Unidad>('unidades');
    return this.unidadesCollection.add({nombre: unidad.nombre, descripcion: unidad.descripcion});
  }

  // Metodo para obtener una unidad especifica de Firebase.
	getUnidad(id: string) {
		this.unidadDoc = this.afs.doc<Unidad>(`unidades/${id}`); // Ruta de la unidad en particular.
		return this.unidad = this.unidadDoc.snapshotChanges().pipe(map( action =>{
			if(action.payload.exists == false){
				return null;
			} else {
				const data = action.payload.data() as Unidad;
				data.id = action.payload.id;
				return data;
			}
		}));
  }

  // TODO: Falta implementar metodo.
  updateUnidad(unidad: Unidad):void {}

  // TODO: Falta implementar metodo.
  deleteUnidad( id: string):void {}
}
