import { Usuario } from '../../admin/models/usuario';
export interface Solicitud {
	id?: string;
	nombre_edificio?: string;
  piso_edificio?: number;
  fecha?: Date,
	hora?: Date,
	objectID?: number;
  estado:string;
  usuario?: Usuario;
  idProcess?: string;
  nombre_subcapa?: string;
  descripcion?: string;

}
