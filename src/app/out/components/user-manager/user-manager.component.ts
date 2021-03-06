import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

// Services
import { UserManagementActions } from '../../services/enums.service';
import { AuthService } from '../../services/auth.service';
import { ShowMessagesService } from '../../services/show-messages.service';
import { UsuarioService } from '../../../admin/services/usuario.service';

// Modelos
import { Usuario } from '../../../admin/models/usuario';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit, OnDestroy {

  ngUnsubscribe: Subject<any> = new Subject<any>();
  actions = UserManagementActions;

  // The user management action to be completed
  mode: string;
  // Just a code Firebase uses to prove that
  // this is a real password reset.
  actionCode: string;

  newPassword: string;
  confirmPassword: string;
  mail: string;

  usuario: Usuario;

  actionCodeChecked: boolean;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private swal: ShowMessagesService,
              private authService: AuthService,
              private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        // if we didn't receive any parameters,
        // we can't do anything
        if (!params) {this.router.navigate(['/home']);}

        this.mode = params['mode'];
        this.actionCode = params['oobCode'];

        switch (params['mode']) {
          case UserManagementActions.resetPassword: {
            this.swal.showLoading();
            // Verify the password reset code is valid.
            this.authService
            .getAuth()
            .verifyPasswordResetCode(this.actionCode)
            .then(email => {
              this.swal.stopLoading();
              this.actionCodeChecked = true;
              this.mail = email;
            }).catch(e => {
              // Invalid or expired action code. Ask user to try to
              // reset the password again.
              this.swal.stopLoading();
              this.swal.showErrorMessage(e.code);
              this.router.navigate(['/login']);
            });
          } break
          case UserManagementActions.recoverEmail: {

          } break
          case UserManagementActions.verifyEmail: {

            // Recibe el actionCode y lo verifica.
            this.authService.getAuth()
            .checkActionCode(this.actionCode)
            .then((user) => {
              this.authService.getAuth()
              .applyActionCode(this.actionCode) // Aplica el código. Cambia el emailVerified a true.
              .then(() => {

                // Si el actionCode es correcto entra aquí.
                this.actionCodeChecked = true;
                this.swal.showEmailVerifiedMessage(); // Muestra mensaje de verificación
                this.router.navigate(['/login']); // Va al login

              }).catch((error) => {
                this.swal.showErrorMessage(error.code);
                this.router.navigate(['/login']);
              });
            }).catch((er)=>{
              this.swal.showErrorMessage(er.code);
              this.router.navigate(['/login']);

            });

          } break
          default: {
            this.swal.showErrorMessage('paramsNoFoundError');
            this.router.navigate(['/home']);
          }
        }
      })
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

  /**
   * Attempt to confirm the password reset with firebase and
   * navigate user back to home.
   */
  handleResetPassword(form: NgForm) {
    if(form.invalid){return;}
    if (this.newPassword != this.confirmPassword) {
      this.swal.showErrorMessage('passNoSameError');
      return;
    }
    this.swal.showLoading();
    // Save the new password.
    this.authService.getAuth().confirmPasswordReset(this.actionCode, this.newPassword)
    .then(resp => {
      this.obtenerUsuario(this.mail)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        if(user && user.length > 0) {
          this.usuario = {
            ...user[0]
          };
          this.usuario.password = this.newPassword;
          this.actualizarUsuario(this.usuario).then(() => {
            this.swal.stopLoading();
            // Password reset has been confirmed and new password updated.
            this.swal.showSuccessMessage('updatePassSuccess');
            this.router.navigate(['/login']);
          });
        }
      });

    }).catch(e => {
      // Error occurred during confirmation. The code might have
      // expired or the password is too weak.
      this.swal.stopLoading();
      this.swal.showErrorMessage(e.code);
    });
  }

  /**
   * Metodo para buscar en la base de datos al usuario con el correo mencionado
   * @param email correo del usuario a obtener
   */
  obtenerUsuario(email: string) {
    return this.usuarioService.getUserEstado(email);
  }

  /**
   * Método para actualizar un usuario en la base de datos
   * @param usuario usuario a actualizar
   */
  actualizarUsuario(usuario: Usuario) {
    return this.usuarioService.updateUsuario(usuario);
  }

}
