import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';

//Models
import { Unidad } from '../models/unidad';
import { Perfil } from '../models/perfil';
import { Usuario } from '../models/usuario';
import { AreaTecnica } from '../models/areaTecnica';

//Services
import { UnidadService } from '../services/unidad.service';
import { PerfilService } from '../services/perfil.service';
import { AreaTecnicaService } from '../services/areaTecnica.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: '../views/registro.component.html',
  styleUrls: ['../../assets/css/login.css'],
  providers: [UnidadService, PerfilService, AreaTecnicaService, AuthService]
})
export class RegistroComponent implements OnInit {
  public perfiles: Perfil[];
  public unidades:Unidad[];
  public areasTecnicas:AreaTecnica[];
  public usuario:Usuario;

  constructor(private _router: Router,
              private _unidadService: UnidadService,
              private _perfilService: PerfilService,
              private _areaTecnicaService: AreaTecnicaService,
              private _authService: AuthService) { }

  ngOnInit() {
    console.log('registro.component.ts cargado...');
    this.usuario = new Usuario(null, null, null, null, null, null, null, 'Pendiente');
    this.getUnidades();
    this.getPerfiles();
    this.getAreasTecnicas();
   }

   onSubmit(form: NgForm){
     if(form.invalid){ return;}
     if(this.usuario.unidad_id == null ){ this.usuario.unidad_id = 1;}
     if(this.usuario.area_id == null){ this.usuario.area_id = 1; }

     
     this.usuario.unidad_id = +this.usuario.unidad_id;
     this.usuario.area_id = +this.usuario.area_id;

     if(this.usuario.perfil == "Solicitante"){this.usuario.area_id = 1;}
     else if(this.usuario.perfil == "6"){this.usuario.unidad_id = 1;}
     else{this.usuario.area_id = 1;this.usuario.unidad_id = 1;}

     Swal.fire({
       allowOutsideClick: false,
       type: 'info',
       text: 'Espere por favor...'
     });
     Swal.showLoading();

     this._authService.nuevoUsuario( this.usuario )
       .subscribe( resp => {

         console.log(resp);
         Swal.close();

         this._router.navigateByUrl('/home');

       }, (err) => {
         console.log(err.error.error.message);
         Swal.fire({
           type: 'error',
           title: 'Error al autenticar',
           text: err.error.error.message
         });
       });
   } //end onSubmit

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

   //Metodo para obtener de la base de datos todos los perfiles haciendo uso del servicio
   getPerfiles(){
     this._perfilService.getPerfiles().subscribe(
       result => {
         if(result['code'] != 202){
           console.log(result);
         } else {
           this.perfiles = result['data'];
         }
       },
       error => {
         console.log(<any>error);
       }
     );
   }

   //Metodo para obtener de la base de datos todas las areas tecnicas haciendo uso del servicio
   getAreasTecnicas(){
     this._areaTecnicaService.getAreasTecnicas().subscribe(
       result => {
         if(result['code'] != 202){
           console.log(result);
         } else {
           this.areasTecnicas = result['data'];
         }
       },
       error => {
         console.log(<any>error);
       }
     );
   }
}
