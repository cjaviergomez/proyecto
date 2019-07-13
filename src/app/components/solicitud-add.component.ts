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
	public seccion: number;  //Para trabajar el formulario por secciones, la variable empieza en 1.
	public formulario;
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
		this.seccion = 1;
		this.fecha_actual = new Date();
		this.hora = this.fecha_actual.toLocaleTimeString('en-US', {hour12:true, hour:'numeric', minute: 'numeric'});
		this.fecha_actual = this.datePipe.transform(this.fecha_actual, 'dd/MM/yyyy');

		this.formulario = {
			'fecha': this.fecha_actual,
			'hora': this.hora,
			'elementos': {},
			'especial': {}
		};

		this.solicitud = new Solicitud(0, 1 ,'Ingeniería Mecánica', 1, 45, 'Pendiente', this.formulario);
	}

	ngOnInit(){
		console.log('solicitud-add.component.ts cargado...');
	}

	onSubmit(){
		console.log(this.solicitud.formulario);

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
						this._router.navigate(['/solicitud-creada']);
					}else{
						console.log(response);
						this._router.navigate(['/solicitud-error']);
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
		this.seccion = this.seccion + 1;
	}

	seccionAnterior(){
		this.seccion = this.seccion - 1;
	}
}
