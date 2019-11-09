import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

//Servicios
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';

// Models
import { Usuario } from '../models/usuario';
import { url } from 'inspector';
import { userInfo } from 'os';

@Component({
  selector: 'app-config',
  templateUrl: '../views/config.html',
  styleUrls: ['../../assets/css/config.css'],
  providers: [UsuarioService, AuthService]
})
export class ConfigComponent implements OnInit {

  usuario: Usuario = new Usuario();
  cargando = false;
  seccion: number;

  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  nameImageUp: string;

  @ViewChild('imageUser', {static: true}) inputImageUser: ElementRef;

  constructor(private usuarioService: UsuarioService,
    private authService: AuthService,
    private storage: AngularFireStorage){}

  ngOnInit() {
    this.seccion = 1;
    this.cargando = true;
    this.cargarUsuario();
  }


  cambiarSeccion(seccion: number) {
    this.seccion = seccion;
  }

  cargarUsuario(){
    this.authService.estaAutenticado().subscribe( user => {
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
    this.authService.estaAutenticado().subscribe( user => {
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

}
