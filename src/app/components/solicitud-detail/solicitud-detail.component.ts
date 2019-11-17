import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Services
import { SolicitudService } from '../../services/solicitud.service';

// Models
import { Solicitud } from '../../models/solicitud';

@Component({
	selector: 'solicitud-detail',
	templateUrl: './solicitud-detail.component.html'
})
export class SolicitudDetailComponent implements OnInit {
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

			/* this._solicitudService.getSolicitud(id).subscribe(
				response => {
					if(response['code'] == 202){
						this.solicitud = response['data'];
					}else{
						this._router.navigate(['/solicitudes']);
					}
				},
				error => {
					console.log(<any>error);
				}
			); */
		});
	}

}
