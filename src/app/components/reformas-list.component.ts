import { Component, OnInit } from '@angular/core';

import { ReformaService } from '../services/reforma.service';
import { Reforma } from '../models/reforma';

@Component({
	selector: 'reformas-list',
	templateUrl: '../views/reformas-list.html',
	providers: [ReformaService]
})
export class ReformasListComponent implements OnInit{
	public titulo: string;
	public reformas: Reforma[];
	public confirmado: number;
	public cont:number; //variable para saber la cantidad de solicitudes.

	constructor(
		private _solicitudService: ReformaService
	){
		this.titulo = 'Reformas';
		this.confirmado = null;
		this.cont = 0;
	}

	ngOnInit(){
		console.log('reformas-list.component.ts cargado');
		this.getSolicitudes();
	}

	//Metodo para obtener todas las solicitudes usando el metodo getSolicitudes del servicio.
	getSolicitudes(){
		this._solicitudService.getReformas().subscribe(
			result => {
				if(result['code'] != 202){
					console.log(result);
				} else {
					this.reformas = result['data'];
					this.cont = this.reformas.length;
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}
}
