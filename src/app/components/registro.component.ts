import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private router: Router,
              private unidadService: UnidadService,
              private perfilService: PerfilService,
              private areaTecnicaService: AreaTecnicaService,
              private usuarioService: UsuarioService,
              private authService: AuthService) { }

  ngOnInit() {
    console.log('registro.component.ts cargado...');
    this.usuario = {
      nombres: '',
      correo: '',
      password: '',
      foto:'',
      perfil: null,
      unidad_id: null,
      area_id: null,
      estado: 'Pendiente',
    };
  
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

     this.authService.nuevoUsuario( this.usuario )
       .then( resp => {
         Swal.close();
         this.guardarUsuario(this.usuario);
         this.registroMensaje('sucess');
       }).catch( err => {
         this.registroMensaje(err.code);
       });
   } //end onSubmit

   //Metodo para mostrar un mensaje si el usuario se registro correctamente o no.
   registroMensaje(code: string){
    if(code == 'sucess'){
      Swal.fire({
        allowOutsideClick: false,
        type: 'success',
        title: 'Registro Exitoso',
        text: 'Su cuenta se ha registrado con éxito. Por favor Inicie Sesión'
      });
    }else if(code == 'auth/email-already-in-use'){
      Swal.fire({
        allowOutsideClick: false,
        type: 'error',
        title: 'Error al registrar',
        text: 'El correo ya esta en uso. Por favor intente con un correo diferente o inicie sesión.'
      });
    }
   }

   //Metodo para obtener todas las Unidades academica administrativas usando el metodo getUnidades del servicio.
   getUnidades(){
     this.unidadService.getUnidades().subscribe(
       resp => {
         this.unidades = resp;
       });
   }

   //Metodo para obtener de la base de datos todos los perfiles haciendo uso del servicio
   getPerfiles(){
     this.perfilService.getPerfiles().subscribe(
       resp => {
         this.perfiles = resp;
       });
   }


   //Metodo para obtener de la base de datos todas las areas tecnicas haciendo uso del servicio
   getAreasTecnicas(){
     this.areaTecnicaService.getAreasTecnicas().subscribe(
       resp => {
         this.areasTecnicas = resp;
       });
   }

   //Metodo para guardar en firebase la informacion del usuario registrado haciendo uso del servicio.
   guardarUsuario(usuario:Usuario){
     return this.usuarioService.crearUsuario( usuario )
                .then( () => { console.log('Usuario agregado'); })
                .catch( (err) => { console.log('ERROR AL GUARDAR', err); });
   }

   //Metodo para verificar que cada usuario tenga la informaciòn adecuada.
   //EJ: Si se registra un usuario con el perfil solicitante, que no vaya a tener asignado el atributo area_id porque un solicitante no pertenece a ningun area tecnica
   validarUsuario(){
     if(this.usuario.perfil == 'Solicitante'){ delete this.usuario.area_id;} //Si el usuario es un solicitante, elimino la propiedad area_id
     else if(this.usuario.perfil == 'UAA Asesora'){ delete this.usuario.unidad_id;}  //Si el usuario es una UAA Asesora, elimino la propiedad unidad_id
     else{delete this.usuario.area_id;delete this.usuario.unidad_id;} //Si no es ni un solicitante ni una UAA Asesora, elimino las propiedades area_id y unidad_id
   }
}
