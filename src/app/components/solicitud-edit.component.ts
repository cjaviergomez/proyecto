import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolicitudService } from '../services/solicitud.service';
import { Solicitud } from '../models/solicitud';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'solicitud-edit',
	templateUrl: '../views/solicitud-add.html',
	providers: [SolicitudService]
})
export class SolicitudEditComponent{
	public titulo: string;
	public solicitud: Solicitud;
	public filesToUpload;
	public resultUpload;
	public is_edit;

	constructor(
		private _solicitudService: SolicitudService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.titulo = 'Editar solicitud';
		this.solicitud = new Solicitud(1,'','',1,'');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log(this.titulo);
		this.getProducto();
	}

	onSubmit(){
		console.log(this.solicitud);

		if(this.filesToUpload && this.filesToUpload.length >= 1){
			this._solicitudService.makeFileRequest(GLOBAL.url+'upload-file', [], this.filesToUpload).then((result) => {
				console.log(result);

				this.resultUpload = result;
				this.solicitud.imagen = this.resultUpload.filename;
				this.updateProducto();

			}, (error) =>{
				console.log(error);
			});
		}else{
			this.updateProducto();
		}

	}

	updateProducto(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._solicitudService.editProducto(id, this.solicitud).subscribe(
				response => {
					if(response.code == 200){
						this._router.navigate(['/producto', id]);
					}else{
						console.log(response);
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
	}

	getProducto(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._solicitudService.getProducto(id).subscribe(
				response => {
					if(response.code == 200){
						this.solicitud = response.data;
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
