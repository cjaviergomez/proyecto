import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//Servicios
import { AuthService } from './services/auth.service';
import { UsuarioService } from './services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowMessagesService } from './services/show-messages.service';

// Models
import { Usuario } from './models/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public title = 'CampusGIS';
  public islogged = false;
  cargando = false;
  public isVerificador: any = null;
  usuario: Usuario = new Usuario();
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private auth: AuthService,
              private usuarioService: UsuarioService,
              private swal: ShowMessagesService,
              private spinnerService: NgxSpinnerService,
              private router: Router){}

  ngOnInit() {
    this.spinner();
    this.getCurrentUser();
    this.cargando = true;
  }

  //Metodo para cerrar la sesiòn de un usuario haciendo uso del servicio
  salir(){
    this.router.navigate(['/login']);
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
          this.cargando = false;
        });

        this.auth.isUserAdmin(user.uid)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(userRole => {
          if(userRole){
            this.isVerificador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('verificador');
          }
        });
      } else {
        this.islogged = false;
      }
    });
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
