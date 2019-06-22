import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SolicitudService } from '../services/solicitud.service';
import { Solicitud } from '../models/solicitud';

@Component({
	selector: 'solicitud-detail',
	templateUrl: '../views/solicitud-detail.html',
	providers: [SolicitudService]
})
export class SolicitudDetailComponent{
	public solicitud: Solicitud;

	constructor(
		private _solicitudService: SolicitudService,
		private _route: ActivatedRoute,
		private _router: Router
	){}

	ngOnInit(){
		console.log('solicitud-detail.Component.ts cargado...');

		this.getSolicitud();
	}

	getSolicitud(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._solicitudService.getProducto(id).subscribe(
				response => {
					if(response.code == 200){
						this.producto = response.data;
					}else{
						this._router.navigate(['/productos']);
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}

}
