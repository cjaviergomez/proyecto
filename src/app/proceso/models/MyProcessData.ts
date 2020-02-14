import { Material } from './material';

export class MyProcessData {

  //seccion 2
  public materiales?: Material[];
  public elementosProteccion?: Material[];
  public especiales?: Material[];
  public observaciones?: string;

  public approved: boolean;

  constructor() {
    this.approved = false;
   }

}
