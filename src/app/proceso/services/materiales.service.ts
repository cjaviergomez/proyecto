import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelos
import { Material } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  private materialesCollection: AngularFirestoreCollection<Material>;
  private materiales: Observable<Material[]>

  constructor(private afs: AngularFirestore) { }

  //Metodo para agregar solicitudes a la base de datos.
  addSolicitud(material: Material){
    this.materialesCollection = this.afs.collection<Material>('materiales');
    return this.materialesCollection.add({
      nombre: material.nombre,
      descripcion: material.descripcion
    });
  }


	getMaterial(texto:string){
    this.materialesCollection = this.afs.collection<Material>('materiales',  ref => ref.where('nombre', '>=', texto));
    return this.materiales = this.materialesCollection.snapshotChanges()
				.pipe(map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Material;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
  }
}
