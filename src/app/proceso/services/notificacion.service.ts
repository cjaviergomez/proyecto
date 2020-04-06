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

  constructor(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
  }

   // Metodo para notificar a los usuarios de planeación de la nueva solicitud.
   notifyPlaneacion(notificacion: Notificacion) {
    let ngUnsubscribeP: Subject<any> = new Subject<any>();
    this.usuarioService.getUsuariosPlaneacion()
        .pipe(takeUntil(ngUnsubscribeP))
        .subscribe(usuarios => {
          ngUnsubscribeP.next();
          ngUnsubscribeP.complete();
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
    let ngUnsubscribePF: Subject<any> = new Subject<any>();
    this.usuarioService.getUsuariosPlantaFisica()
        .pipe(takeUntil(ngUnsubscribePF))
        .subscribe( usuarios => {
          ngUnsubscribePF.next();
          ngUnsubscribePF.complete();
          usuarios.forEach(usuario =>{
            if(!usuario.notificaciones){
              usuario.notificaciones = [];
            }
            usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
            this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
          });
        });
  }

  // Metodo para agregar una notificación a algún usuario
  notifyUsuario(notificacion: Notificacion, user: Usuario) {
    let ngUnsubscribe: Subject<any> = new Subject<any>();
    this.usuarioService.getUsuario(user.id)
        .pipe(takeUntil(ngUnsubscribe))
        .subscribe(usuario => {
          ngUnsubscribe.next();
          ngUnsubscribe.complete();
          if(!usuario.notificaciones){
            usuario.notificaciones = [];
          }
          usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
          this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
        });
  }

  // Metodo para agregar una notificación a algún usuario
  notifyUsuarioWithId(notificacion: Notificacion, userId: string) {
    let ngUnsubscribe: Subject<any> = new Subject<any>();
    this.usuarioService.getUsuario(userId)
        .pipe(takeUntil(ngUnsubscribe))
        .subscribe(usuario => {
          ngUnsubscribe.next();
          ngUnsubscribe.complete();
          if(!usuario.notificaciones){
            usuario.notificaciones = [];
          }
          usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
          this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
        });
  }

}
