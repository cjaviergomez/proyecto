import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _solicitudService: SolicitudService
	){
		this.titulo = 'Listado de solicitudes';
		this.confirmado = null;
	}

	ngOnInit(){
		console.log('solicitudes-list.component.ts cargado');
		this.getSolicitudes();
	}

	getSolicitudes(){
		this._solicitudService.getSolicitudes().subscribe(

			result => {
				console.log(result.code);
				if(result.code != 202){
					console.log(result);
				}else{
					this.solicitudes = result.data;
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
			/* response => {
				if(response.code == 202){
					this.getSolicitudes();
				}else{
					alert('Error al borrar la solicitud');
				}
			},
			error => {
				console.log(<any>error);
			} */
		);
	}

}
