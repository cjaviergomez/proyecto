import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Iconos
import { faExclamation, faUserCheck, faUserSecret, faUserTie, faUserNinja, faUsersCog, faDatabase, faUserTag, faFolderPlus, faTasks, faPen } from '@fortawesome/free-solid-svg-icons';

//Servicios
import { UsuarioService } from '../../../admin/services/usuario.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { AreaTecnicaService } from '../../../admin/services/areaTecnica.service';
import { AuthService } from '../../../out/services/auth.service';

// Models
import { Usuario } from '../../../admin/models/usuario';
import { AreaTecnica } from '../../../admin/models/areaTecnica';
import { Unidad } from 'app/admin/models/unidad';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {

  public unidad: Unidad;
  public areatecnica: AreaTecnica;
  usuario: Usuario;
  usuarioLogin: Usuario;
  public isVerificador: any = null;
  cargando = false;

  private ngUnsubscribe: Subject<any> = new Subject<any>(); // Observable para desubscribir todos los observables

  // Iconos
  faExclamation = faExclamation; // Icono de exclamación.
  faUserCheck = faUserCheck; // Icono de un usuario chequeado para agregarlo al rol "Verificador"
  faUserSecret = faUserSecret; // Icono para el rol observador general
  faUserTie = faUserTie; // Icono para el rol observador.
  faUserNinja = faUserNinja; // Icono para el rol solucionador
  faUsersCog = faUsersCog; // Icono para el rol modificador.
  faDatabase = faDatabase; // Icono para el rol agregador.
  faUserTag = faUserTag; // Icono para el rol interventor.
  faFolderPlus = faFolderPlus; // Icono para el rol creador
  faTasks = faTasks; // Icono para el rol gestor.
  faPen = faPen;  // Icono para el botón de editar.

  constructor(private route: ActivatedRoute,
              private usuarioService: UsuarioService,
              private unidadService: UnidadService,
              private areaService: AreaTecnicaService,
              private auth: AuthService){}

  ngOnInit() {
    this.getCurrentUser();
    const id = this.route.snapshot.paramMap.get('id'); // Se obtiene el id por la url

    this.cargando = true;
    this.usuarioService.getUsuario(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((usuario: Usuario) => {
      // Obtenemos la informacion del usuario de la base de datos de firebase.
      this.usuario = usuario;
      this.cargando = false;
      if(usuario && usuario.unidad_id) {
        this.unidadService.getUnidad(usuario.unidad_id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( unidad => {
          // Se obtiene la información de la unidad desde la base de datos de firebase.
          this.unidad = unidad;
        });
      }
      if(usuario && usuario.area_id){
        this.areaService.getAreaTecnica(usuario.area_id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( areatecnica => {
          // Se obtiene la información del area técnica desde la base de datos de firebase.
          this.areatecnica = areatecnica;
        });
      }
    });
  }

  // Metodo para saber si el usuario logeado tiene el rol verificador y pueda editar la información.
  getCurrentUser(){
    this.auth.estaAutenticado()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( user => {
      if(user){
        this.auth.isUserAdmin(user.uid)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(userRole => {
          if(userRole){
            this.isVerificador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('verificador');
          }
        });
      }
    });
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
