import { Component, OnInit } from '@angular/core';

//Models
import { Unidad } from '../models/unidad';
import { Perfil } from '../models/perfil';
import { Usuario } from '../models/usuario';
import { AreaTecnica } from '../models/areaTecnica';

//Services
import { UnidadService } from '../services/unidad.service';
import { PerfilService } from '../services/perfil.service';
import { AreaTecnicaService } from '../services/areaTecnica.service';

@Component({
  selector: 'app-registro',
  templateUrl: '../views/registro.component.html',
  styleUrls: ['../../assets/css/login.css'],
  providers: [UnidadService, PerfilService, AreaTecnicaService]
})
export class RegistroComponent implements OnInit {
  public perfiles: Perfil[];
  public unidades:Unidad[];
  public areasTecnicas:AreaTecnica[];
  public usuario:Usuario;

  constructor(private _unidadService: UnidadService,
              private _perfilService: PerfilService,
              private _areaTecnicaService: AreaTecnicaService) {
    this.usuario = new Usuario();
    this.usuario.perfil_id = null;
    this.usuario.area_id = null;
    this.usuario.unidad_id = null;
  }

  ngOnInit() {
    console.log('registro.component.ts cargado...');
    this.getUnidades();
    this.getPerfiles();
    this.getAreasTecnicas();
   }

   onSubmit(){
     console.log(this.usuario);
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
