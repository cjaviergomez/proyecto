import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';

//Servicios
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

// Models
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  providers: [UsuarioService, AuthService]
})
export class ConfigComponent implements OnInit, OnDestroy {

  usuario: Usuario = new Usuario();
  cargando = false;
  seccion: number;
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
            // Actualizamos la foto del perfil a autenticación
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

  desactivarCuenta(usuario: Usuario) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Estás seguro que deseas desactivar tu cuenta?`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        usuario.estado = 'Desactivado';
        this.usuarioService.updateUsuario(usuario).then( ()=> {
          this.router.navigate(['/home']);
          this.authService.logout();
        }).catch((error) => {
          Swal.fire({
            title: 'Error',
            text: error,
            type: 'error',
            showConfirmButton: true
          });
        });
      }
    });
  }

  cambiarContrasena(form: NgForm) {
    if (form.invalid) { return; }
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    if(form.value['password'] != this.usuario.password) {
      Swal.close();
      this.mensajeInfo('errorPassActual');
      return;
    } else if(form.value['password2'] != form.value['password3']) {
      Swal.close();
      this.mensajeInfo('passNoSame');
      return;
    } else {
      this.authService.estaAutenticado().subscribe( user => {
        Swal.close();
        if(user) {
          this.usuario.password = form.value['password2'];
          user.updatePassword(this.usuario.password)
          .then(() => {
            this.usuarioService.updateUsuario(this.usuario).then(() => {
              this.mensajeInfo('updateSuccess');
            });

          }).catch( () => {
            this.mensajeInfo('errorInesperado');
          });
        }
      });

    }
  }

  mensajeInfo(mensaje: string) {
    switch(mensaje) {
      case 'errorPassActual': {
        Swal.fire({
          type: 'error',
          title: 'Contraseña actual incorrecta',
          text: 'Por favor verifica que la contraseña actual sea correcta.'
        });
         break;
      }
      case 'passNoSame': {
        Swal.fire({
          type: 'error',
          title: 'Las contraseñas con coinciden',
          text: 'Por favor verifica que las nuevas contraseñas coincidan.'
        });
         break;
      }
      case 'updateSuccess': {
        Swal.fire({
          type: 'success',
          title: 'Contraseña actualizada',
          text: 'Se actualizó la contraseña correctamente.'
        });
        break;
      }
      default: {
        Swal.fire({
          type: 'error',
          title: 'Error al actualizar',
          text: 'Ha ocurrido un error inesperado. Intentalo de nuevo'
        });
         break;
      }
   }
  }

   // Called once, before the instance is destroyed.
	ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
	}

}
