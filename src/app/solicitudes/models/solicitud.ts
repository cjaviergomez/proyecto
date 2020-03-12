import { Usuario } from '../../admin/models/usuario';
export interface Solicitud {
	id?: string;
	nombre_edificio?: string;
  piso_edificio?: number;
  fecha?: Date,
	hora?: Date,
	objectID?: number;
  estado?:string;
  usuario?: Usuario;
  idProcess?: string;
  nombre_subcapa?: string;
  descripcion?: string;

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

  urlInformeFinanciero?: string;
  nombreInformeFinanciero?: string;

  urlAval?: string;
  nombreAval?: string;
}
