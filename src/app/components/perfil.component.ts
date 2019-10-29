import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

//Servicios
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service';
import { UnidadService } from '../services/unidad.service';
import { AreaTecnicaService } from '../services/areaTecnica.service';

// Models
import { Usuario } from '../models/usuario';
import { AreaTecnica } from '../models/areaTecnica';
import { Unidad } from 'app/models/unidad';

@Component({
  selector: 'app-perfil',
  templateUrl: '../views/perfil.html',
  styleUrls: ['../../assets/css/perfil.css'],
  providers: [AreaTecnicaService, UsuarioService, UnidadService]
})
export class PerfilComponent implements OnInit, OnDestroy {

  private subcripcion: Subscription;
  public unidad: Unidad;
  public areatecnica: AreaTecnica;
  usuario: Usuario = {
    nombres: '',
    perfil: {
      nombre: '',
      descripcion: ''
    },
    correo: '',
    estado: '',
    photoUrl: '',
  };

  constructor(private authService: AuthService,
              private usuarioService: UsuarioService,
              private unidadService: UnidadService,
              private areaService: AreaTecnicaService){}

  ngOnInit() {
    this.subcripcion = this.authService.estaAutenticado().subscribe( user => {
      if (user) {
        this.usuario.nombres = user.displayName;
        this.usuario.correo = user.email;
        this.usuario.photoUrl = user.photoURL;

        this.usuarioService.getUsuario(user.uid).subscribe((usuario: Usuario) => {
          // Obtenemos el nombre del perfil del usuario de la base de datos de firebase.
          this.usuario.perfil.nombre = usuario.perfil.nombre;
          this.usuario.perfil.descripcion = usuario.perfil.descripcion;
          this.usuario.estado = usuario.estado;
          if(usuario.unidad_id){
            this.unidadService.getUnidad(usuario.unidad_id).subscribe( unidad => {
              this.unidad = unidad;
            });
          }
          if(usuario.area_id){
            this.areaService.getAreaTecnica(usuario.area_id).subscribe( areatecnica => {
              this.areatecnica = areatecnica;
            });
          }
        });
      }
    });
  }

   // Called once, before the instance is destroyed.
	ngOnDestroy(): void {
		if(this.subcripcion) {
			this.subcripcion.unsubscribe();
		}
	}
}
