import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Solicitud } from '../models/solicitud';

@Injectable()
export class SolicitudService {
	private solicitudesCollection: AngularFirestoreCollection<Solicitud>;
	private solicitudes: Observable<Solicitud[]>

	constructor(private afs: AngularFirestore){
		this.solicitudesCollection = this.afs.collection<Solicitud>('solicitudes');
		this.solicitudes = this.solicitudesCollection.valueChanges();
	}

	// Metodo para obtener todas las solicitudes almacenadas en la base de datos de firebase.
	getSolicitudes(){
		return this.solicitudes = this.solicitudesCollection.snapshotChanges()
		.pipe(map( changes => {
			return changes.map( action => {
				const data = action.payload.doc.data() as Solicitud;
				data.id = action.payload.doc.id;
				return data;
			})
		}));
	}

	getSolicitud(id:string){}

	addSolicitud(solicitud: Solicitud){}

	editSolicitud(id:number, solicitud: Solicitud){}

	deleteSolicitud(id:number){}

}
