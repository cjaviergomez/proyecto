import { Usuario } from '../../admin/models/usuario';
export interface Solicitud {
	id?: string;
	nombre_edificio?: string;
  piso_edificio?: number;
  fecha?: string;
	objectID?: number;
  estado:string;
  usuario?: Usuario;
  idProcess?: string;
  nombre_subcapa?: string;


		//seccion 1
		/* public entidad_solicitante: string,
		public fecha: Date,
		public hora: Date,
		public nombre_solicitante:string,
		public descripcion: string, */

		//seccion 2
		/* public fecha_visita: string,
		public hora_visita: string,
		public funcionario_asignado:string,
		public funcionario_visita:string */

}