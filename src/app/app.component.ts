import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Iconos
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

//Servicios
import { AuthService } from './out/services/auth.service';
import { UsuarioService } from './admin/services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';

// Models
import { Usuario } from './admin/models/usuario';
import { Notificacion } from './in/models/notificacion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public title = 'CampusGIS';
  public islogged = false;
  public isVerificador: any = null;
  public isAgregador: any = null;
  public isSolucionador: any = null;
  usuario: Usuario;
  notificacionesCount: number = 0; // Variables para indicar el número de notificaciones que no sean visto.
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //Iconos
  faExclamation = faExclamation; //Icono para colocar cuando no hay notificaciones.

  constructor(private auth: AuthService,
              private usuarioService: UsuarioService,
              private spinnerService: NgxSpinnerService,
              private router: Router){}

  ngOnInit() {
    this.spinner();
    this.getCurrentUser();
  }

  //Metodo para cerrar la sesiòn de un usuario haciendo uso del servicio
  salir(){
    this.router.navigate(['/modOut/login']);
    this.auth.logout();
  }

  // Metodo para saber si hay un usuario logeado actualmente.
  getCurrentUser(){
    this.auth.estaAutenticado()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( user => {
      if(user){
        this.islogged = true;
        this.usuarioService.getUsuario(user.uid)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((usuario: Usuario) => {
          // Obtenemos la información del usuario de la base de datos de firebase.
          this.usuario = usuario;
          if(this.usuario.notificaciones){
            this.notificacionesNoReadedCount(this.usuario.notificaciones);
          }
        });

        this.auth.isUserAdmin(user.uid)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(userRole => {
          if(userRole){
            this.isVerificador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('verificador');
            this.isAgregador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('agregador');
            this.isSolucionador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('solucionador');
          }
        });
      } else {
        this.islogged = false;
      }
    });
  }

  // Metodo para determinar cuantas de las notificaciones aún no han sido leidas.
  notificacionesNoReadedCount(notificaciones: Notificacion[]){
    this.notificacionesCount = 0;
    if(notificaciones.length > 0){
      notificaciones.forEach((notificacion: Notificacion) => {
        if(notificacion.leido === false){
          this.notificacionesCount = this.notificacionesCount + 1;
        }
      });
    }
  }

  // Metodo para cambiarle el estado a la notificación y después ir a la solicitud que está asociada a la notificación.
  onNotificacion(notificacion: Notificacion){
    if(notificacion.leido === true){
      this.router.navigate(['/modSolicitudes/solicitud', notificacion.solicitudId]);
    } else {
      this.usuario.notificaciones.forEach((notificacionU, index) => {
        if(notificacion.id === notificacionU.id){
          this.usuario.notificaciones[index].leido = true;
          this.usuarioService.updateUsuario(this.usuario).then(()=>{
            this.router.navigate(['/modSolicitudes/solicitud', notificacion.solicitudId]);
          });
        }
      });
    }
  }

  spinner(): void {
    this.spinnerService.show();
        setTimeout(() => {
            this.spinnerService.hide();
        }, 2000);
  }

  /**
   * Este metodo se ejecuta cuando el componente se destruye
   * Usamos este método para cancelar todos los observables.
   */
  ngOnDestroy(): void {
    // End all subscriptions listening to ngUnsubscribe
    // to avoid memory leaks.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
	}

}
