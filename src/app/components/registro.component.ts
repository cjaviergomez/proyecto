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
import { PerfilService } from '../services/perfil.service';
import { UnidadService } from '../services/unidad.service';
import { AreaTecnicaService } from '../services/areaTecnica.service';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: '../views/registro.component.html',
  styleUrls: ['../../assets/css/login.css'],
  providers: [UnidadService, PerfilService, AreaTecnicaService, AuthService]
})
export class RegistroComponent implements OnInit {
  public perfiles: Perfil[] = [];
  public unidades:Unidad[];
  public areasTecnicas:AreaTecnica[];
  public usuario:Usuario;

  constructor(private _router: Router,
              private _unidadService: UnidadService,
              private _perfilService: PerfilService,
              private _areaTecnicaService: AreaTecnicaService,
              private _usuarioService: UsuarioService,
              private _authService: AuthService) { }

  ngOnInit() {
    console.log('registro.component.ts cargado...');
    this.usuario = new Usuario();
    this.usuario.perfil = null;
    this.usuario.unidad_id = null;
    this.usuario.area_id = null;
    this.usuario.estado = 'Pendiente';
    this.getPerfiles();
    this.getUnidades();
    this.getAreasTecnicas();
   }

   onSubmit(form: NgForm){
     if(form.invalid){ return;}
     this.validarUsuario();
     Swal.fire({
       allowOutsideClick: false,
       type: 'info',
       text: 'Espere por favor...'
     });
     Swal.showLoading();

     this._authService.nuevoUsuario( this.usuario )
       .subscribe( resp => {
         Swal.close();
         this.guardarUsuario();

         Swal.fire({
           allowOutsideClick: false,
           type: 'success',
           title: 'Registro Exitoso',
           text: 'Su cuenta se ha registrado con éxito. Por favor Inicie Sesión'
         });

       }, (err) => {
         console.log(err.error.error.message);
         Swal.fire({
           type: 'error',
           title: 'Error al registrar',
           text: err.error.error.message
         });
       });
   } //end onSubmit

   //Metodo para obtener todas las Unidades academica administrativas usando el metodo getUnidades del servicio.
   getUnidades(){
     this._unidadService.getUnidades().subscribe(
       resp => {
         this.unidades = resp;
       });
   }

   //Metodo para obtener de la base de datos todos los perfiles haciendo uso del servicio
   getPerfiles(){
     this._perfilService.getPerfiles().subscribe(
       resp => {
         this.perfiles = resp;
       });
   }


   //Metodo para obtener de la base de datos todas las areas tecnicas haciendo uso del servicio
   getAreasTecnicas(){
     this._areaTecnicaService.getAreasTecnicas().subscribe(
       resp => {
         this.areasTecnicas = resp;
       });
   }

   //Metodo para guardar en firebase la informacion del usuario registrado haciendo uso del servicio.
   guardarUsuario(){
     return this._usuarioService.crearUsuario( this.usuario );
   }

   //Metodo para verificar que cada usuario tenga la informaciòn adecuada.
   //EJ: Si se registra un usuario con el perfil solicitante, que no vaya a tener asignado el atributo area_id porque un solicitante no pertenece a ningun area tecnica
   validarUsuario(){
     if(this.usuario.perfil == 'Solicitante'){ delete this.usuario.area_id;} //Si el usuario es un solicitante, elimino la propiedad area_id
     else if(this.usuario.perfil == 'UAA Asesora'){ delete this.usuario.unidad_id;}  //Si el usuario es una UAA Asesora, elimino la propiedad unidad_id
     else{delete this.usuario.area_id;delete this.usuario.unidad_id;} //Si no es ni un solicitante ni una UAA Asesora, elimino las propiedades area_id y unidad_id
   }
}
