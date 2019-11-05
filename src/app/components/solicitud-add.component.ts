import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Services
import { SolicitudService } from '../services/solicitud.service';
import { UnidadService } from '../services/unidad.service';

// Models
import { Solicitud } from '../models/solicitud';
import { Unidad } from '../models/unidad';

@Component({
	selector: 'solicitud-add',
	templateUrl: '../views/solicitud-add.html',
	styleUrls: ['../app.component.css'],
	providers: [SolicitudService, DatePipe, UnidadService]
})
export class SolicitudAddComponent implements OnInit{
	public solicitud: Solicitud;
	public unidades:Unidad[];
	public seccion: number;  //Para trabajar el formulario por secciones, la variable empieza en 1.
	public formulario;
	public fecha_actual;
	public hora;
	public filesToUpload;
	public resultUpload;

	constructor(
		private _solicitudService: SolicitudService,
		private _unidadService: UnidadService,
		private _route: ActivatedRoute,
		private _router: Router,
		private datePipe: DatePipe
	){
		this.seccion = 1;
		this.fecha_actual = new Date();
		this.hora = this.fecha_actual.toLocaleTimeString('en-US', {hour12:true, hour:'numeric', minute: 'numeric'});
		this.fecha_actual = this.datePipe.transform(this.fecha_actual, 'dd/MM/yyyy');

		this.formulario = {
			'fecha': this.fecha_actual,
			'entidad_solicitante': "",
			'hora': this.hora,
			'elementos': {},
			'especiales': {}
		};
		this.solicitud = {
			estado: 'Pendiente'
		}
	}

	ngOnInit(){
		console.log('solicitud-add.component.ts cargado...');
		this.getUnidades();

	}

	//Metodo para obtener todas las Unidades academica administrativas usando el metodo getUnidades del servicio.
	getUnidades(){
		this._unidadService.getUnidades().subscribe(
			result => {
				if(result['code'] != 202){
					console.log(result);
				} else {
					this.unidades = result['data'];
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	onSubmit(){
		this.saveSolicitud();
	}

	saveSolicitud(){
			/* this._solicitudService.addSolicitud(this.solicitud).subscribe(
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
			); */
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

	actualSeccion(sesion:number){
		this.seccion = sesion;
	}
}
