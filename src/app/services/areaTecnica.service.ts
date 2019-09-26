import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';

import { AreaTecnica } from '../models/areaTecnica';

@Injectable()
export class AreaTecnicaService {
	public url: string;

	constructor(
		public http: HttpClient
	) {
		this.url = 'https://campusgis-f9154.firebaseio.com';
	}

	getAreasTecnicas() {
		return this.http.get(`${this.url}/areasTecnicas.json`)
			.pipe(
				map(this.crearArreglo),
				delay(0)
				);
			}

	// Metodo para convertir en un arreglo de perfiles el json que extraigo de Firebase
	private crearArreglo( areasObj: object){

		const areas: AreaTecnica[] = [];

		if(areasObj === null){ return []; }

		Object.keys( areasObj ).forEach( key => {

			const area: AreaTecnica = areasObj[key];
			area.id = key;

			areas.push( area );
		});

		return areas;
	}

}
