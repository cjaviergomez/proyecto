import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

//Servicios
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';

// Models
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-config',
  templateUrl: '../views/config.html',
  styleUrls: ['../../assets/css/config.css'],
  providers: [UsuarioService, AuthService]
})
export class ConfigComponent implements OnInit, OnDestroy {

  usuario: Usuario = new Usuario();
  cargando = false;
  seccion: number;
  subcripcionUsuario: Subscription;

  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  nameImageUp: string;

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
    this.subcripcionUsuario = this.authService.estaAutenticado().subscribe( user => {
      if(user){
        this.usuarioService.getUsuario(user.uid).subscribe((usuario: Usuario) => {
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
    this.subcripcionUsuario = this.authService.estaAutenticado().subscribe( user => {
      if(user){
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
        this.usuarioService.updateUsuario(usuario);
        this.router.navigate(['/home']);

      }
    });
  }

  ngOnDestroy() {

      this.subcripcionUsuario.unsubscribe();

  }

}
