import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';

import { Perfil } from '../models/perfil';

@Injectable({
	providedIn: 'root'
})
export class PerfilService{
	private url: string;

	constructor(private http: HttpClient) {
		this.url = 'https://campusgis-f9154.firebaseio.com';
	}

	getPerfiles() {
		return this.http.get(`${this.url}/perfiles.json`)
		.pipe(
			map(this.crearArreglo),
			delay(0)
			);
	}
	// Metodo para convertir en un arreglo de perfiles el json que extraigo de Firebase
	private crearArreglo(perfilesObj: object) {

		const perfiles: Perfil[] = [];

		if (perfilesObj === null) { return []; }

		Object.keys(perfilesObj).forEach(key => {
			const perfil: Perfil = perfilesObj[key];
			perfil.id = key;
			if (perfil.id !== '0') { // Agregar todos los perfiles menos el perfil administrador
				perfiles.push(perfil);
			}
		});
		return perfiles;
	}

}
