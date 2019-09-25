import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';

import { Unidad } from '../models/unidad';

@Injectable({
  providedIn: 'root'
})
export class UnidadService{
	public url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = "https://campusgis-f9154.firebaseio.com";
	}

	//TODO: Actualizar metodo a AngularFire2
	//Metodo para obtener de la base de datos de firebase las unidades.
	getUnidades(){
		return this._http.get(`${this.url}/unidades.json`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
	}

	//Metodo para convertir en un arreglo de perfiles el json que extraigo de Firebase
	private crearArreglo( unidadesObj: object){

		const unidades: Unidad[] = [];
		if(unidadesObj === null){ return []; }

		Object.keys( unidadesObj ).forEach( key => {

			const unidad: Unidad = unidadesObj[key];
			unidad.id = key;

			unidades.push( unidad );
		});

		return unidades;
	}

}
