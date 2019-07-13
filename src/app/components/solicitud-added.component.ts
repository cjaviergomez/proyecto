import { Component } from '@angular/core';

@Component({
	selector: 'solicitud-added',
	templateUrl: '../views/solicitud-added.html',
})

export class SolicitudAddedComponent{
  public titulo: string;

  constructor(){
    this.titulo = "¡Solicitud creada con éxito!";
  }
}
