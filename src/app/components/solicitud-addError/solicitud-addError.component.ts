import { Component } from '@angular/core';

@Component({
	selector: 'solicitud-addError',
	templateUrl: './solicitud-addError.component.html',
})

export class SolicitudAddErrorComponent {
  public titulo: string;

  constructor(){
    this.titulo = '¡Error al crear la solicitud!';
  }
}
