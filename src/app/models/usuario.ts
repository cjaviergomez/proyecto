import { Perfil } from './perfil';

export interface Usuario {
	id?: string;
	nombres?: string;
	perfil?: Perfil;
	unidad_id?:string;
	area_id?:string;
	correo?: string;
	password?: string;
	estado?: string;
	photoUrl?:string;
}
