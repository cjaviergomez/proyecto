export class Solicitud{
	constructor(
		public solicitud_id: number,
		public nombre_edificio: string,
		public piso_edificio: number,
		public objectID: number,
		public estado:string,
		public formulario:JSON

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
	){}
}
