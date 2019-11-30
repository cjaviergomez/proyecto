import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelo
import { Mensaje } from '../models/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  private mensajesCollection: AngularFirestoreCollection<Mensaje>;
	private mensajes: Observable<Mensaje[]>;
	private mensajeDoc: AngularFirestoreDocument<Mensaje>;
	private mensaje: Observable<Mensaje>;

  constructor(private afs: AngularFirestore) { }

   // Metodo para agregar un mensaje a la base de datos de firebase.
   addMensaje(m: Mensaje){
    this.mensajesCollection = this.afs.collection<Mensaje>('mensajes');
    return this.mensajesCollection.add({
      fecha: m.fecha,
      nombres: m.nombres,
      apellidos: m.apellidos,
      correo: m.correo,
      mensaje: m.mensaje,
      estado: m.estado
    });
  }

  // Método para obtener todos los mensajes de la base de datos.
  getMensajes() {
    this.mensajesCollection = this.afs.collection<Mensaje>('mensajes');
		return this.mensajes = this.mensajesCollection.snapshotChanges()
				.pipe(map( changes => {
					return changes.map( action => {
						const data = action.payload.doc.data() as Mensaje;
						data.id = action.payload.doc.id;
						return data;
			})
		}));
  }

  // Metodo para obtener un Mensaje especifico de Firebase.
	getMensaje(id: string) {
		this.mensajeDoc = this.afs.doc<Mensaje>(`mensajes/${id}`); // Ruta del usuario en particular.
		return this.mensaje = this.mensajeDoc.snapshotChanges().pipe(map( action =>{
			if(action.payload.exists == false){
				return null;
			}else{
				const data = action.payload.data() as Mensaje;
				data.id = action.payload.id;
				return data;
			}
		}));
  }

  // Metodo para actualizar la informaciòn de un mensaje en Firebase.
	updateMensaje(mensaje: Mensaje) {
		let idMensaje = mensaje.id;
		delete mensaje.id; // Le borramos el id al usuario para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados.
		this.mensajeDoc = this.afs.doc<Mensaje>(`mensajes/${idMensaje}`);
		return this.mensajeDoc.update(mensaje);
	 }

	// Metodo para borrar a un usuario de la base de datos de firebase.
	deleteMensaje(id: string): void {
		this.mensajeDoc = this.afs.doc<Mensaje>(`mensajes/${id}`);
		this.mensajeDoc.delete();
	}
}
