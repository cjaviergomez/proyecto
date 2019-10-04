import { Perfil } from './perfil';

export interface Usuario{
	id?: string;
	nombres?: string;
	perfil?: Perfil;
	unidad_id?:number;
	area_id?:number;
	correo?: string;
	password?: string;
	estado?: string;
	photoUrl?:string;
}
