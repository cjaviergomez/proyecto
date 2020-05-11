import { Usuario } from '../../admin/models/usuario';
export interface Solicitud {
	id?: string;
	nombre_edificio?: string;
	nombre_subcapa?: string;
	piso_edificio?: number;
	objectID?: number;

	idEdificio?: string;
	idSubCapa?: string;

	fecha?: Date;
	hora?: Date;
	estado?: string;
	usuario?: Usuario;
	idProcess?: string;
	descripcion?: string;

	interventorId?: string;

	dsiId?: string;
	mtId?: string;

	urlCTDSI?: string;
	nombreCTDSI?: string;

	urlCTMT?: string;
	nombreCTMT?: string;

	urlCTPlaneacion?: string;
	nombreCTPlaneacion?: string;

	urlCotizacion?: string;
	nombreCotizacion?: string;

	urlProveedores?: string;
	nombreProveedores?: string;

	urlAval?: string;
	nombreAval?: string;

	urlMinuta?: string;
	nombreMinuta?: string;

	urlSeguimientoObra?: string;
	nombreSeguimientoObra?: string;

	urlInformeSupervision?: string;
	nombreInformeSupervision?: string;

	urlActaFinObra?: string;
	nombreActaFinObra?: string;

	urlActaLiquidacionObra?: string;
	nombreActaLiquidacionObra?: string;

	urlResolucion?: string;
	nombreResolucion?: string;

	urlActaLiquidacionC?: string;
	nombreActaLiquidacionC?: string;

	urlEntregaR?: string;
	nombreEntregaR?: string;
}
