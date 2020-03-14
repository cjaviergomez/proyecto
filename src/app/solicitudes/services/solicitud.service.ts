import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
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

	// Metodo para obtener todas las solicitudes almacenadas en la base de datos de firebase.
	getSolicitudes(){
    this.solicitudesCollection = this.afs.collection<Solicitud>('solicitudes');
		return this.solicitudes = this.solicitudesCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as Solicitud;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
  }

  //Metodo para agregar solicitudes a la base de datos.
  addSolicitud(solicitud: Solicitud){
    this.solicitudesCollection = this.afs.collection<Solicitud>('solicitudes');
    return this.solicitudesCollection.add({
      estado: solicitud.estado,
      nombre_edificio: solicitud.nombre_edificio,
      piso_edificio: solicitud.piso_edificio,
      fecha: solicitud.fecha,
      hora: solicitud.hora,
      usuario: {
        ...solicitud.usuario
      },
      objectID: solicitud.objectID,
      nombre_subcapa: solicitud.nombre_subcapa,
      idProcess: solicitud.idProcess,
      descripcion: solicitud.descripcion
    });
  }

  // Metodo para obtener una solicitud especifica de Firebase.
  getSolicitud(id: string) {
    this.solicitudDoc = this.afs.doc<Solicitud>(`solicitudes/${id}`); // Ruta de la solicitud en particular en firebase.
    return this.solicitud = this.solicitudDoc.snapshotChanges().pipe(map( action => {
      if(action.payload.exists == false) {
        return null;
      } else {
        const data = action.payload.data() as Solicitud;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

  // Metodo para obtener una solicitud que esta asociada a un proceso en especifico.
  getSolicitudProcess(idProcess: string) {
    this.solicitudesCollection = this.afs.collection<Solicitud>('solicitudes', ref => ref.where('idProcess', '==', idProcess));
		return this.solicitudes = this.solicitudesCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as Solicitud;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
  }

  	// Metodo para actualizar la informaciòn de una solicitud en Firebase.
	updateSolicitud(solicitud: Solicitud) {
		let idSolicitud = solicitud.id;
		delete solicitud.id; // Le borramos el id a la solicitud para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados.
		this.solicitudDoc = this.afs.doc<Solicitud>(`solicitudes/${idSolicitud}`);
		return this.solicitudDoc.update(solicitud);
	 }

  // Metodo para borrar a una solicitud de la base de datos de firebase.
	deleteSolicitud(id: string): void {
		this.solicitudDoc = this.afs.doc<Solicitud>(`solicitudes/${id}`);
		this.solicitudDoc.delete();
	}
}
