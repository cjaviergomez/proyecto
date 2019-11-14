import { Component } from '@angular/core';

@Component({
	selector: 'solicitud-added',
	templateUrl: './solicitud-added.component.html',
})

export class SolicitudAddedComponent{
  public titulo: string;

  constructor(){
    this.titulo = '¡Solicitud creada con éxito!';
  }
}
