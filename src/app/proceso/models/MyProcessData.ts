import { Material } from './material';

export class MyProcessData {

  constructor(
    public materiales: Material[],
    public elementosProteccion: Material[],
    public especiales: Material[],
    public observaciones: string,
    public approved: boolean
    ){ }

}
