import { Injectable } from '@angular/core';
import { Documento } from 'app/proceso/models/documento';
import {
	AngularFirestoreCollection,
	AngularFirestoreDocument,
	AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class TiposDocumentsService {
	private documentosCollection: AngularFirestoreCollection<Documento>;
	private documentos: Observable<Documento[]>;
	private documentoDoc: AngularFirestoreDocument<Documento>;
	private documento: Observable<Documento>;

	constructor(private afs: AngularFirestore) {}

	// Metodo para obtener de la base de datos de firebase los tipos de documentos incluido su id.
	getTiposDocuments() {
		this.documentosCollection = this.afs.collection<Documento>('tiposDocuments');
		return (this.documentos = this.documentosCollection.snapshotChanges().pipe(
			map((changes) => {
				return changes.map((action) => {
					const data = action.payload.doc.data() as Documento;
					data.id = action.payload.doc.id;
					return data;
				});
			})
		));
	}

	// Método para agregar una unidad a la base de datos
	addDocumento(documento: Documento) {
		this.documentosCollection = this.afs.collection<Documento>('tiposDocuments');
		return this.documentosCollection.add({
			id: documento.id,
			name: documento.name,
			label: documento.label,
			descripcion: documento.descripcion
		});
	}

	// Metodo para obtener una unidad especifica de Firebase.
	getDocumento(id: string) {
		this.documentoDoc = this.afs.doc<Documento>(`tiposDocuments/${id}`); // Ruta de la unidad en particular.
		return (this.documento = this.documentoDoc.snapshotChanges().pipe(
			map((action) => {
				if (action.payload.exists == false) {
					return null;
				} else {
					const data = action.payload.data() as Documento;
					data.id = action.payload.id;
					return data;
				}
			})
		));
	}

	updateDocumento(documento: Documento) {
		const idDocumento = documento.id;
		delete documento.id; // Le borramos el id al usuario para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados
		return this.afs.collection<Documento>('tiposDocuments').doc(idDocumento).set(documento);
	}
}
