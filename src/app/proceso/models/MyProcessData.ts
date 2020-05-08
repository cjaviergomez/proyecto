import { Material } from './material';
import { Documento } from './documento';

export class MyProcessData {
	constructor(
		public materiales: Material[],
		public elementosProteccion: Material[],
		public especiales: Material[],
		public documents: Documento[],
		public observaciones: string,
		public approved: boolean
	) {}
}
