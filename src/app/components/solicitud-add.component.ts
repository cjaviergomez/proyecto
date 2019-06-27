import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SolicitudService } from '../services/solicitud.service';
import { Solicitud } from '../models/solicitud';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'solicitud-add',
	templateUrl: '../views/solicitud-add.html',
	providers: [SolicitudService, DatePipe]
})
export class SolicitudAddComponent{
	public titulo: string;
	public solicitud: Solicitud;
	public seccion: string;
	public fecha_actual;
	public hora;
	public filesToUpload;
	public resultUpload;

	constructor(
		private _solicitudService: SolicitudService,
		private _route: ActivatedRoute,
		private _router: Router,
		private datePipe: DatePipe
	){
		this.titulo = 'Crear una nueva solicitud';
		this.seccion = "Descripción del servicio";
		this.fecha_actual = new Date();
		this.hora = this.fecha_actual.toLocaleTimeString('en-US', {hour12:true, hour:'numeric', minute: 'numeric'});
		this.fecha_actual = this.datePipe.transform(this.fecha_actual, 'dd/MM/yyyy');
		this.solicitud = new Solicitud(0, 1 ,'Mecánica', 1, 45, 'Pendiente', '','', this.fecha_actual, this.hora, '', '','','','','');
	}

	ngOnInit(){
		console.log('solicitud-add.component.ts cargado...');
	}

	onSubmit(){
		console.log(this.solicitud);

		if(this.filesToUpload && this.filesToUpload.length >= 1){
			this._solicitudService.makeFileRequest(GLOBAL.url+'upload-file', [], this.filesToUpload).then((result) => {
				console.log(result);

				this.resultUpload = result;
				//this.solicitud.imagen = this.resultUpload.filename;
				this.saveSolicitud();

			}, (error) =>{
				console.log(error);
			});
		}else{
			this.saveSolicitud();
		}

	}

	saveSolicitud(){
			this._solicitudService.addSolicitud(this.solicitud).subscribe(
				response => {
					if(response['code'] == 202){
						this._router.navigate(['/solicitudes']);
					}else{
						console.log(response);
					}
				},
				error => {
					console.log(<any>error);
				}
			);
	}

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
	}

	seccionSiguiente(){
		if(this.seccion == 'Descripción del servicio'){
			this.seccion = 'Certificado de visita';
		}else if(this.seccion == 'Certificado de visita'){
			this.seccion = 'Requerimientos';
		}else if(this.seccion == 'Requerimientos'){
			this.seccion = 'Observaciones';
		}
	}

	seccionAnterior(){
		if(this.seccion == 'Certificado de visita'){
			this.seccion = 'Descripción del servicio';
		}else if(this.seccion == 'Requerimientos'){
			this.seccion = 'Certificado de visita';
		}else if(this.seccion == 'Observaciones'){
			this.seccion = 'Requerimientos';
		}
	}
}
