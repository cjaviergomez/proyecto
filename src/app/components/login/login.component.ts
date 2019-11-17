import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Iconos de Fontawesome
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

//Modelos
import { Usuario } from '../../models/usuario';

//Servicios
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { ShowMessagesService } from '../../services/show-messages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public usuario: Usuario;
  private isActive: boolean;
  public mostrar = false;
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  // Iconos
  faEyeSlash = faEyeSlash;
  faEye = faEye;

  constructor(private authService: AuthService,
              private usuarioService: UsuarioService,
              private swal: ShowMessagesService,
              private router: Router) {
                this.isActive = false;
              }

  ngOnInit() {
    this.usuario = {
      nombres: '',
      correo: ''
    };
  }

  /**
   * Método para validar la información del usuario para permitirle iniciar sessión.
   * @param form formulario con la informacion del usuario a loguear (correo y contraseña)
   */
  onSubmit(form: NgForm) {
    if (form.invalid) { return; }
    this.swal.showLoading();

    // Se verifica que el estado del usuario sea "Activado"
    this.usuarioService.getUserEstado(this.usuario.correo).pipe(
      takeUntil(this.ngUnsubscribe)).subscribe( user => {
        if (user && user.length > 0 && user[0].estado == 'Activado'){
          this.isActive = true;
        }
      });

    // Inicia sessión. Si es todo del usuario no es Activo, cierra la sesión.
    this.authService.login( this.usuario )
          .then( resp => {
            this.swal.stopLoading();
            if(this.isActive === true){
              this.router.navigateByUrl('/map');
            } else {
              this.authService.logout();
              this.swal.showErrorMessage('noActiveError');
            }
          }).catch( err => {
            this.swal.showErrorMessage(err.code);
          });
  }

  /**
   * Método para cambiar la visibilidad de la contraseña.
   * @param valor booleano para mostrar u ocultar la contraseña
   */
  mostrarPass(valor: boolean) {
    this.mostrar = valor;
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
