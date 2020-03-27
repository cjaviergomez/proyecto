import { Perfil } from './perfil';
import { Notificacion } from 'app/in/models/notificacion';

export class Usuario {
	id?: string;
	nombres?: string;
	perfil?: Perfil;
  unidad_id?:string;
  cargo?: string;
	area_id?:string;
	correo?: string;
	password?: string;
	estado?: string;
  photoUrl?:string;
  primerIngreso?: boolean;
  notificaciones?: Notificacion[];

	constructor(){}
}
