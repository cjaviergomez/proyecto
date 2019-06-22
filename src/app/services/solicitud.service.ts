import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
//import { Observable } from 'rxjs/Observable';
import { Solicitud } from '../models/solicitud';
import { GLOBAL } from './global';

@Injectable()
export class SolicitudService{
	public url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = GLOBAL.url;
	}

	getSolicitudes(){
		//return this._http.get(this.url+'productos').map(res => res.json());
	}

	getSolicitud(id){
		//return this._http.get(this.url+'producto/'+id).map(res => res.json());
	}

	addSolicitud(solicitud: Solicitud){
		let json = JSON.stringify(solicitud);
		let params = 'json='+json;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		//return this._http.post(this.url+'productos', params, {headers: headers}) .map(res => res.json());
	}

	editSolicitud(id, solicitud: Solicitud){
		let json = JSON.stringify(solicitud);
		let params = "json="+json;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		//return this._http.post(this.url+'update-producto/'+id, params, {headers: headers}).map(res => res.json());
	}

	deleteSolicitud(id){
		//return this._http.get(this.url+'delete-producto/'+id).map(res => res.json());
	}

	makeFileRequest(url: string, params: Array<string>, files: Array<File>){
		return new Promise((resolve, reject)=>{
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();

			for(var i = 0; i < files.length; i++){
				formData.append('uploads[]', files[i], files[i].name);
			}

			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			};

			xhr.open("POST", url, true);
			xhr.send(formData);
		});
	}

}
