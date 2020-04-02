import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//Servicios
import { UsuarioService } from 'app/admin/services/usuario.service';

//Modelos
import { Notificacion } from 'app/in/models/notificacion';
import { Usuario } from 'app/admin/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  usuarioService: UsuarioService;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private ngUnsubscribeP: Subject<any> = new Subject<any>();
  private ngUnsubscribePF: Subject<any> = new Subject<any>();

  constructor(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
  }

   // Metodo para notificar a los usuarios de planeación de la nueva solicitud.
   notifyPlaneacion(notificacion: Notificacion) {
    this.usuarioService.getUsuariosPlaneacion()
        .pipe(takeUntil(this.ngUnsubscribeP))
        .subscribe(usuarios => {
          this.ngUnsubscribeP.next();
          this.ngUnsubscribeP.complete();
          usuarios.forEach(usuario => {
            if(!usuario.notificaciones){
              usuario.notificaciones = [];
            }
            usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
            this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
          });
        });
  }

  // Metodo para notificar a los usuarios de Planta Física de la nueva solicitud.
  notifyPlantaFisica(notificacion: Notificacion){
    this.usuarioService.getUsuariosPlantaFisica()
        .pipe(takeUntil(this.ngUnsubscribePF))
        .subscribe( usuarios => {
          this.ngUnsubscribePF.next();
          this.ngUnsubscribePF.complete();
          usuarios.forEach(usuario =>{
            if(!usuario.notificaciones){
              usuario.notificaciones = [];
            }
            usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
            this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
          });
        });
  }

  // Metodo para notificar a los usuarios de planeación de la nueva solicitud.
  notifyUsuario(notificacion: Notificacion, usuario: Usuario) {
    this.usuarioService.getUserEstado(usuario.correo)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(usuarios => {
          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
          usuarios.forEach(usuario => {
            if(!usuario.notificaciones){
              usuario.notificaciones = [];
            }
            usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
            this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
          });
        });
  }
}
