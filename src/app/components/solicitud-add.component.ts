import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SolicitudService } from '../services/solicitud.service';
import { Solicitud } from '../models/solicitud';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'solicitud-add',
	templateUrl: '../views/solicitud-add.html',
	providers: [SolicitudService]
})
export class SolicitudAddComponent{
	public titulo: string;
	public solicitud: Solicitud;
	public filesToUpload;
	public resultUpload;

	constructor(
		private _solicitudService: SolicitudService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.titulo = 'Crear un nuevo producto';
		this.solicitud = new Solicitud(0,'','',0,'');
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
				this.solicitud.imagen = this.resultUpload.filename;
				this.saveProducto();

			}, (error) =>{
				console.log(error);
			});
		}else{
			this.saveProducto();
		}

	}

	saveProducto(){
			this._solicitudService.addProducto(this.solicitud).subscribe(
				response => {
					if(response.code == 200){
						this._router.navigate(['/productos']);
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
}
