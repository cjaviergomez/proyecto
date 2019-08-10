import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Reforma } from '../models/reforma';
import { GLOBAL } from './global';

@Injectable()
export class ReformaService{
	public url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = GLOBAL.url;
	}

	getReformas(){
		return this._http.get(this.url+'reformas');
	}

}
