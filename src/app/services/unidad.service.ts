import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from './global';

@Injectable()
export class UnidadService{
	public url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = GLOBAL.url;
	}

	getUnidades(){
		return this._http.get(this.url+'unidades');
	}

}
