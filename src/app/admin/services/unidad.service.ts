import { Injectable } from '@angular/core';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelos
import { Unidad } from '../models/unidad';

/**
 * Método para hacer todo el CRUD con respecto a la Unidades.
 */
@Injectable({
	providedIn: 'root'
})
export class UnidadService {
	private unidadesCollection: AngularFirestoreCollection<Unidad>;
	private unidades: Observable<Unidad[]>;
	private unidadDoc: AngularFirestoreDocument<Unidad>;
	private unidad: Observable<Unidad>;

	constructor(private afs: AngularFirestore) {}

	/**
	 * Metodo para obtener de la base de datos de firebase las unidades incluido su id.
	 */
	getUnidades(): Observable<Unidad[]> {
		this.unidadesCollection = this.afs.collection<Unidad>('unidades');
		return (this.unidades = this.unidadesCollection.snapshotChanges().pipe(
			map((changes) => {
				return changes.map((action) => {
					const data = action.payload.doc.data() as Unidad;
					data.id = action.payload.doc.id;
					return data;
				});
			})
		));
	}

	/**
	 * Método para agregar una unidad a la base de datos.
	 * @param unidad Unidad a añadir a la base de datos.
	 */
	addUnidad(unidad: Unidad) {
		this.unidadesCollection = this.afs.collection<Unidad>('unidades');
		return this.unidadesCollection.add({ nombre: unidad.nombre, descripcion: unidad.descripcion });
	}

	/**
	 * Metodo para obtener una unidad especifica de Firebase.
	 * @param id id de la unidad a consultar en la base de datos.
	 */
	getUnidad(id: string): Observable<Unidad> {
		this.unidadDoc = this.afs.doc<Unidad>(`unidades/${id}`); // Ruta de la unidad en particular.
		return (this.unidad = this.unidadDoc.snapshotChanges().pipe(
			map((action) => {
				if (action.payload.exists == false) {
					return null;
				} else {
					const data = action.payload.data() as Unidad;
					data.id = action.payload.id;
					return data;
				}
			})
		));
	}

	/**
	 * Método para actualizar una unidad en la base de datos.
	 * @param unidad Unidad a actualizar
	 */
	updateUnidad(unidad: Unidad): Promise<void> {
		const idUnidad = unidad.id;
		delete unidad.id; // Le borramos el id al usuario para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados.
		this.unidadDoc = this.afs.doc<Unidad>(`unidades/${idUnidad}`);
		return this.unidadDoc.update(unidad);
	}
}
