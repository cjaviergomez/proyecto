import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//Servicios
import { UsuarioService } from 'app/admin/services/usuario.service';

//Modelos
import { Notificacion } from 'app/in/models/notificacion';
import { Usuario } from 'app/admin/models/usuario';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  usuarioService: UsuarioService;

  constructor(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
  }

  /**
   *  Metodo para notificar a los usuarios de planeación de la nueva solicitud.
   * @param notificacion notificacion a enviar al usuario de planeación
   */
  notifyPlaneacion(notificacion: Notificacion): void {
    const ngUnsubscribeP: Subject<any> = new Subject<any>();
    this.usuarioService
      .getUsuariosPlaneacion()
      .pipe(takeUntil(ngUnsubscribeP))
      .subscribe((usuarios) => {
        ngUnsubscribeP.next();
        ngUnsubscribeP.complete();
        usuarios.forEach((usuario) => {
          if (!usuario.notificaciones) {
            usuario.notificaciones = [];
          }
          usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
          this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
        });
      });
  }

  /**
   *  Metodo para notificar a los usuarios de Planta Física de la nueva solicitud.
   * @param notificacion notificacion a enviar a los usuarios de planta física.
   */
  notifyPlantaFisica(notificacion: Notificacion): void {
    const ngUnsubscribePF: Subject<any> = new Subject<any>();
    this.usuarioService
      .getUsuariosPlantaFisica()
      .pipe(takeUntil(ngUnsubscribePF))
      .subscribe((usuarios) => {
        ngUnsubscribePF.next();
        ngUnsubscribePF.complete();
        usuarios.forEach((usuario) => {
          if (!usuario.notificaciones) {
            usuario.notificaciones = [];
          }
          usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
          this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
        });
      });
  }

  /**
   *  Metodo para notificar a los usuarios de la Oficina de contratación de la nueva solicitud.
   * @param notificacion notificacion a enviar a los usuarios de la oficina de contratación
   */
  notifyOficinaContratacion(notificacion: Notificacion): void {
    const ngUnsubscribePF: Subject<any> = new Subject<any>();
    this.usuarioService
      .getUsuariosOficinaContratacion()
      .pipe(takeUntil(ngUnsubscribePF))
      .subscribe((usuarios) => {
        ngUnsubscribePF.next();
        ngUnsubscribePF.complete();
        usuarios.forEach((usuario) => {
          if (!usuario.notificaciones) {
            usuario.notificaciones = [];
          }
          usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
          this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
        });
      });
  }

  /**
   * Metodo para agregar una notificación a algún usuario
   * @param notificacion notificacion a agregarle al usuario.
   * @param user usuario al que se le va a agregar la notificación
   */
  notifyUsuario(notificacion: Notificacion, user: Usuario): void {
    const ngUnsubscribe: Subject<any> = new Subject<any>();
    this.usuarioService
      .getUsuario(user.id)
      .pipe(takeUntil(ngUnsubscribe))
      .subscribe((usuario) => {
        ngUnsubscribe.next();
        ngUnsubscribe.complete();
        if (!usuario.notificaciones) {
          usuario.notificaciones = [];
        }
        usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
        this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
      });
  }

  /**
   *  Metodo para agregar una notificación a algún usuario
   * @param notificacion notificación que se va agregar al usuario
   * @param userId id del usuario que se va a notificar.
   */
  notifyUsuarioWithId(notificacion: Notificacion, userId: string): void {
    const ngUnsubscribe: Subject<any> = new Subject<any>();
    this.usuarioService
      .getUsuario(userId)
      .pipe(takeUntil(ngUnsubscribe))
      .subscribe((usuario) => {
        ngUnsubscribe.next();
        ngUnsubscribe.complete();
        if (!usuario.notificaciones) {
          usuario.notificaciones = [];
        }
        usuario.notificaciones.push(notificacion); // Le añadimos la notificación al usuario.
        this.usuarioService.updateUsuario(usuario); // Actualizamos el usuario.
      });
  }
}
