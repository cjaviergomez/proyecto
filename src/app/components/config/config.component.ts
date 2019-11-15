import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';

//Servicios
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { ShowMessagesService } from '../../services/show-messages.service';

// Models
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  providers: [UsuarioService, AuthService, ShowMessagesService]
})
export class ConfigComponent implements OnInit, OnDestroy {

  usuario: Usuario = new Usuario();
  cargando = false;
  seccion: number; // para mostrar las diferentes secciones (foto, contraseña, cuenta)
  private ngUnsubscribe = new Subject();

  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  nameImageUp: string;

  passSave = {
    actual: '',
    new: '',
    new2: ''
  };

  @ViewChild('imageUser', {static: true}) inputImageUser: ElementRef;

  constructor(private usuarioService: UsuarioService,
              private authService: AuthService,
              private swal: ShowMessagesService,
              private storage: AngularFireStorage,
              private router: Router){}

  ngOnInit() {
    this.seccion = 1;
    this.cargando = true;
    this.cargarUsuario();
  }


  cambiarSeccion(seccion: number) {
    this.seccion = seccion;
  }

  cargarUsuario(){
    this.authService.estaAutenticado().pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe( user => {
        if(user){
          this.usuarioService.getUsuario(user.uid).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe((usuario: Usuario) => {
              // Obtenemos la información del usuario de la base de datos de firebase.
              this.usuario = usuario;
              this.cargando = false;
            });
        }
      });
  }

  onUpload(e) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    if(file){
      this.nameImageUp = file.name;
    }
    const filePath = `img/profile_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();

  }

  cambiarImagen() {
    this.authService.estaAutenticado().pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe( user => {
        if(user) {
          this.urlImage.subscribe( url => {
            // Actualizamos la foto del perfil en fireAuth
            user.updateProfile({
              photoURL: url
            });

            // Actualizamos la foto en la base de datos.
            this.usuario.photoUrl = url;
            this.usuarioService.updateUsuario(this.usuario);

            // Reiniciamos las variables.
            this.urlImage = null;
            this.nameImageUp = null;
          });
        }
    });
  }

  /**
   * Método para desactivar la cuenta del usuario.
   * Este método actualiza al usuario en firebase Database.
   * @param usuario usuario que se va a desactivar
   */
  desactivarCuenta(usuario: Usuario) {
    this.swal.showQuestionMessage('disableAccount').then(resp => {
      if (resp.value) {
        usuario.estado = 'Desactivado';
        this.usuarioService.updateUsuario(usuario).then( ()=> {
          this.router.navigate(['/home']);
          this.authService.logout();
        }).catch((error) => {
          this.swal.showErrorMessage('');
        });
      }
    });
  }

  /**
   * Metodo para cambiar la contraseña del usuario.
   * La contraseña se actualiza tanto en fireAuth como en firebase Database.
   * @param form formulario con las contraseñas (antigua, nueva y repetición de la nueva)
   */
  cambiarContrasena(form: NgForm) {
    if (form.invalid) { return; }
    this.swal.showLoading();

    if(form.value['password'] != this.usuario.password) {
      this.swal.stopLoading();
      this.swal.showErrorMessage('passActualError');
      return;
    } else if(form.value['password2'] != form.value['password3']) {
      this.swal.stopLoading();
      this.swal.showErrorMessage('passNoSameError');
      return;
    } else {
      this.authService.estaAutenticado().subscribe( user => {
        if(user) {
          this.usuario.password = form.value['password2'];
          user.updatePassword(this.usuario.password)
          .then(() => {
            this.usuarioService.updateUsuario(this.usuario).then(() => {
              this.swal.stopLoading();
              this.swal.showSuccessMessage('updatePassSuccess');
            });

          }).catch( () => {
            this.swal.showErrorMessage('');
          });
        }
      });

    }
  }

  /**
   * Este metodo se llama una vez se destruye el componente.
   * Lo usamos para finalizar todos los observables
   */
	ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
	}

}
