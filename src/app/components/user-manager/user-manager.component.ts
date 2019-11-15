import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services
import { UserManagementActions } from '../../services/enums.service';
import { AuthService } from '../../services/auth.service';
import { ShowMessagesService } from '../../services/show-messages.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-user-managert',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css'],
  providers: [UserManagementActions, AuthService, ShowMessagesService, UsuarioService]
})
export class UserManagerComponent implements OnInit, OnDestroy {

  ngUnsubscribe: Subject<any> = new Subject<any>();
  actions = UserManagementActions;

  // The user management actoin to be completed
  mode: string;
  // Just a code Firebase uses to prove that
  // this is a real password reset.
  actionCode: string;

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  mail: string;

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

          } break
          default: {
            this.swal.showErrorMessage('paramsNoFoundError');
            this.router.navigate(['/home']);
          }
        }
      })
  }

  ngOnDestroy() {
    // End all subscriptions listening to ngUnsubscribe
    // to avoid memory leaks.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Attempt to confirm the password reset with firebase and
   * navigate user back to home.
   */
  handleResetPassword() {
    if (this.newPassword != this.confirmPassword) {
      this.swal.showErrorMessage('passNoSameError');
      return;
    }
    // Save the new password.
    this.authService.getAuth().confirmPasswordReset(this.actionCode, this.newPassword)
    .then(resp => {

      // Password reset has been confirmed and new password updated.
      this.swal.showSuccessMessage('updatePassSuccess');
      this.router.navigate(['/login']);
    }).catch(e => {
      // Error occurred during confirmation. The code might have
      // expired or the password is too weak.
      this.swal.showErrorMessage(e.code);
    });
  }

}
