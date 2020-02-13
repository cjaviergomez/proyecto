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

  private elementosCollection: AngularFirestoreCollection<Material>;
  private elementos: Observable<Material[]>

  private especialesCollection: AngularFirestoreCollection<Material>;
  private especiales: Observable<Material[]>

  constructor(private afs: AngularFirestore) { }

  //Metodo para agregar materiales de obra a la base de datos.
  addMaterial(material: Material){
    this.materialesCollection = this.afs.collection<Material>('materiales');
    return this.materialesCollection.add({
      nombre: material.nombre.charAt(0).toUpperCase() + material.nombre.slice(1),
      descripcion: material.descripcion
    });
  }


	getMaterial(texto:string){
    this.materialesCollection = this.afs.collection<Material>('materiales',  ref => ref.where('nombre', '>=', texto.charAt(0).toUpperCase() + texto.slice(1)));
    return this.materiales = this.materialesCollection.snapshotChanges()
				.pipe(map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Material;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
  }

  //Metodo para agregar elementos de protección a la base de datos.
  addElemento(elemento: Material){
    this.elementosCollection = this.afs.collection<Material>('elementos');
    return this.elementosCollection.add({
      nombre: elemento.nombre.charAt(0).toUpperCase() + elemento.nombre.slice(1),
      descripcion: elemento.descripcion
    });
  }


	getElemento(texto:string){
    this.elementosCollection = this.afs.collection<Material>('elementos',  ref => ref.where('nombre', '>=', texto.charAt(0).toUpperCase() + texto.slice(1)));
    return this.elementos = this.elementosCollection.snapshotChanges()
				.pipe(map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Material;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
  }

  //Metodo para agregar elementos de protección a la base de datos.
  addEspecial(elemento: Material){
    this.especialesCollection = this.afs.collection<Material>('especiales');
    return this.especialesCollection.add({
      nombre: elemento.nombre.charAt(0).toUpperCase() + elemento.nombre.slice(1),
      descripcion: elemento.descripcion
    });
  }


	getEspecial(texto:string){
    this.especialesCollection = this.afs.collection<Material>('especiales',  ref => ref.where('nombre', '>=', texto.charAt(0).toUpperCase() + texto.slice(1)));
    return this.especiales = this.especialesCollection.snapshotChanges()
				.pipe(map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Material;
						data.id = action.payload.doc.id;
						return data;
					})
				}));
  }
}
