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
  styleUrls: ['./login.component.css'],
  providers:[AuthService, UsuarioService, ShowMessagesService]
})
export class LoginComponent implements OnInit, OnDestroy {

  public usuario: Usuario;
  private isActive: boolean;
  public mostrar = false;
  private ngUnsubscribe = new Subject();

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

  onSubmit(form: NgForm) {
    if (form.invalid) { return; }
    this.swal.showLoading();

    this.usuarioService.getUserEstado(this.usuario.correo).pipe(
      takeUntil(this.ngUnsubscribe)).subscribe( user => {
        if (user && user.length > 0 && user[0].estado == 'Activado'){
          this.isActive = true;
        }
      });

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

  mostrarPass(valor: boolean) {
    this.mostrar = valor;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
	}
}
