import { Injectable } from '@angular/core';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelos
import { Solicitud } from '../models/solicitud';

@Injectable({
	providedIn: 'root'
})
export class SolicitudService {
	private solicitudesCollection: AngularFirestoreCollection<Solicitud>;
	private solicitudDoc: AngularFirestoreDocument<Solicitud>;
	private solicitudes: Observable<Solicitud[]>;
	private solicitud: Observable<Solicitud>;

	constructor(private afs: AngularFirestore) {}

	/**
	 * Método para obtener todas las solicitudes almacenadas en la base de datos de firebase.
	 */
	getSolicitudes(): Observable<Solicitud[]> {
		this.solicitudesCollection = this.afs.collection<Solicitud>('solicitudes');
		return (this.solicitudes = this.solicitudesCollection.snapshotChanges().pipe(
			map((changes) => {
				return changes.map((action) => {
					const data = action.payload.doc.data() as Solicitud;
					data.id = action.payload.doc.id;
					return data;
				});
			})
		));
	}

	/**
	 * Método para agregar solicitudes a la base de datos.
	 * @param solicitud solicitud a agregar a Firebase.
	 */
	addSolicitud(solicitud: Solicitud): Promise<Solicitud> {
		this.solicitudesCollection = this.afs.collection<Solicitud>('solicitudes');
		return this.solicitudesCollection.add({
			nombre_edificio: solicitud.nombre_edificio,
			nombre_subcapa: solicitud.nombre_subcapa,
			piso_edificio: solicitud.piso_edificio,
			objectID: solicitud.objectID,
			idEdificio: solicitud.idEdificio,
			idSubCapa: solicitud.idSubCapa,
			fecha: solicitud.fecha,
			hora: solicitud.hora,
			estado: solicitud.estado,
			usuario: {
				...solicitud.usuario
			},
			idProcess: solicitud.idProcess,
			descripcion: solicitud.descripcion,
			urlDocumentos: solicitud.urlDocumentos,
			nombreDocumentos: solicitud.nombreDocumentos
		});
	}

	/**
	 * Método para obtener una solicitud especifica de Firebase.
	 * @param id id de la solicitud a obtener
	 */
	getSolicitud(id: string): Observable<Solicitud> {
		this.solicitudDoc = this.afs.doc<Solicitud>(`solicitudes/${id}`); // Ruta de la solicitud en particular en firebase.
		return (this.solicitud = this.solicitudDoc.snapshotChanges().pipe(
			map((action) => {
				if (action.payload.exists == false) {
					return null;
				} else {
					const data = action.payload.data() as Solicitud;
					data.id = action.payload.id;
					return data;
				}
			})
		));
	}

	/**
	 * Método para obtener una solicitud que esta asociada a un proceso en especifico.
	 * @param idProcess id del proceso vinculado a la solicitud.
	 */
	getSolicitudProcess(idProcess: string): Observable<Solicitud[]> {
		this.solicitudesCollection = this.afs.collection<Solicitud>('solicitudes', (ref) =>
			ref.where('idProcess', '==', idProcess)
		);
		return (this.solicitudes = this.solicitudesCollection.snapshotChanges().pipe(
			map((changes) => {
				return changes.map((action) => {
					const data = action.payload.doc.data() as Solicitud;
					data.id = action.payload.doc.id;
					return data;
				});
			})
		));
	}

	/**
	 * Método para actualizar la informaciòn de una solicitud en Firebase.
	 * @param solicitud solicitud a actualizar.
	 */
	updateSolicitud(solicitud: Solicitud): Promise<void> {
		const idSolicitud = solicitud.id;
		delete solicitud.id; // Le borramos el id a la solicitud para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados.
		return this.afs.collection<Solicitud>('solicitudes').doc(idSolicitud).set(solicitud);
	}

	/**
	 * Método para borrar a una solicitud de la base de datos de firebase.
	 * @param id id de la solicitud a eliminar
	 */
	deleteSolicitud(id: string): Promise<void> {
		this.solicitudDoc = this.afs.doc<Solicitud>(`solicitudes/${id}`);
		return this.solicitudDoc.delete();
	}
}
