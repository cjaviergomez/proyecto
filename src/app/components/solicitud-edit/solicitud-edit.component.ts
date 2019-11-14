import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Services
import { SolicitudService } from '../../services/solicitud.service';

// Models
import { Solicitud } from '../../models/solicitud';

@Component({
	selector: 'solicitud-edit',
	templateUrl: '../solicitud-add/solicitud-add.component.html',
	providers: [SolicitudService]
})
export class SolicitudEditComponent implements OnInit {
	public titulo: string;
	public solicitud: Solicitud;
	public fecha_actual:Date;
	public hora;
	public filesToUpload;
	public resultUpload;
	public is_edit;

	constructor(
		private _solicitudService: SolicitudService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.titulo = 'Editar solicitud';
		this.solicitud = {
			 estado: 'Pendiente'
		}
		this.is_edit = true;
	}

	ngOnInit(){
		console.log(this.titulo);
		this.getSolicitud();
	}

	onSubmit(){
		console.log(this.solicitud);
		this.updateSolicitud();
	}

	updateSolicitud(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			/* this._solicitudService.editSolicitud(id, this.solicitud).subscribe(
				response => {
					if(response['code'] == 202){
						this._router.navigate(['/solicitud', id]);
					}else{
						console.log(response);
					}
				},
				error => {
					console.log(<any>error);
				}
			); */
		});
	}

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
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
