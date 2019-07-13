import { Component } from '@angular/core';

@Component({
	selector: 'solicitud-addError',
	templateUrl: '../views/solicitud-addError.html',
})

export class SolicitudAddErrorComponent{
  public titulo: string;

  constructor(){
    this.titulo = "¡Error al crear la solicitud!";
  }
}
