import { Component } from '@angular/core';

import { SolicitudService } from '../services/solicitud.service';
import { Solicitud } from '../models/solicitud';

@Component({
	selector: 'solicitudes-list',
	templateUrl: '../views/solicitudes-list.html',
	providers: [SolicitudService]
})
export class SolicitudesListComponent{
	public titulo: string;
	public solicitudes: Solicitud[];
	public confirmado: number;
	public cont:number; //variable para saber la cantidad de solicitudes.

	constructor(
		private _solicitudService: SolicitudService
	){
		this.titulo = 'Listado de solicitudes';
		this.confirmado = null;
		this.cont = 0;
	}

	ngOnInit(){
		console.log('solicitudes-list.component.ts cargado');
		this.getSolicitudes();
	}

	//Metodo para obtener todas las solicitudes usando el metodo getSolicitudes del servicio.
	getSolicitudes(){
		this._solicitudService.getSolicitudes().subscribe(
			result => {
				if(result['code'] != 202){
					console.log(result);
				} else {
					this.solicitudes = result['data'];
					this.cont = this.solicitudes.length;
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	borrarConfirm(id:number){
		this.confirmado = id;
	}

	cancelarConfirm(){
		this.confirmado = null;
	}

	onDeleteSolicitud(id:number){
		this._solicitudService.deleteSolicitud(id).subscribe(
			 response => {
				 console.log(response['message']);
				if(response['code'] == 202){
					this.getSolicitudes();
				}else{
					alert('Error al borrar la solicitud');
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

}
