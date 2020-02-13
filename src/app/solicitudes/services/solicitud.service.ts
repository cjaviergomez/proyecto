import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelos
import { Solicitud } from '../models/solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
	private solicitudesCollection: AngularFirestoreCollection<Solicitud>;
	private solicitudes: Observable<Solicitud[]>

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

  // TODO: Falta implementar metodo.
	getSolicitud(id:string){}

  // TODO: Falta implementar metodo.
	updateSolicitud(solicitud: Solicitud){}

  // TODO: Falta implementar metodo.
	deleteSolicitud(id:string){}
}
