import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
		return this._http.get(this.url+'solicitudes');
	}

	getSolicitud(id:number){
		return this._http.get(this.url+'solicitud/'+id);
	}

	addSolicitud(solicitud: Solicitud){
		let json = JSON.stringify(solicitud);
		let params = 'json='+json;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(this.url+'solicitudes', params, {headers: headers});
	}

	editSolicitud(id:number, solicitud: Solicitud){
		let json = JSON.stringify(solicitud);
		let params = "json="+json;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(this.url+'update-solicitud/'+id, params, {headers: headers});
	}

	deleteSolicitud(id:number){
		return this._http.get(this.url+'delete-solicitud/'+id);
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
					if(xhr.status == 202){
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
