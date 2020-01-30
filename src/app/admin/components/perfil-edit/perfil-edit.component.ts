import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//Servicios
import { UsuarioService } from '../../../admin/services/usuario.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { AreaTecnicaService } from '../../../admin/services/areaTecnica.service';
import { AuthService } from '../../../out/services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

// Models
import { Usuario } from '../../../admin/models/usuario';
import { AreaTecnica } from '../../../admin/models/areaTecnica';
import { Unidad } from 'app/admin/models/unidad';
import { Perfil } from 'app/admin/models/perfil';

// Iconos
import { faExclamation, faSave, faSmileWink, faDizzy, faGrinBeamSweat } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-perfil-edit',
  templateUrl: './perfil-edit.component.html',
  styleUrls: ['./perfil-edit.component.css']
})
export class PerfilEditComponent implements OnInit, OnDestroy {

  public unidad: Unidad;
  public areatecnica: AreaTecnica;
  public areasTecnicas: AreaTecnica[];
  public perfiles: Perfil[] = [];
  public unidades: Unidad[];
  usuario: Usuario;
  usuarioLogin: Usuario;
  public isVerificador: any = null;
  cargando = false;
  private ngUnsubscribe: Subject<any> = new Subject<any>(); // Observable para desubscribir todos los observables

  // Iconos
  faExclamation = faExclamation; // Icono de exclamación.
  faSave = faSave; // Icono para el boton guardar
  faSmileWink = faSmileWink; //Icono para el boton de activado
  faDizzy = faDizzy; // Icono para el boton de desactivado
  faGrinBeamSweat = faGrinBeamSweat; //Icono para el boton de pendiente

  constructor(private route: ActivatedRoute,
              private router: Router,
              private swal: ShowMessagesService,
              private usuarioService: UsuarioService,
              private unidadService: UnidadService,
              private areaService: AreaTecnicaService,
              private perfilService: PerfilService,
              private auth: AuthService){}

  ngOnInit() {
    this.getCurrentUser();
    this.getPerfiles();
    this.getUnidades();
    this.getAreasTecnicas();
    const id = this.route.snapshot.paramMap.get('id'); // Se obtiene el id por la url

    this.cargando = true;
    this.usuarioService.getUsuario(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((usuario: Usuario) => {
      // Obtenemos la informacion del usuario de la base de datos de firebase.
      this.usuario = usuario;
      this.cargando = false;
      if(usuario && usuario.unidad_id) {
        this.getUnidad();
      }
      if(usuario && usuario.area_id) {
        this.getAreaTecnica();
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

  // Metodo para obtener de la base de datos todos los perfiles haciendo uso del servicio
	getPerfiles() {
    this.perfilService.getPerfiles()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
			resp => {
				this.perfiles = resp;
			});
  }

  // Metodo para obtener de la base de datos todas las areas tecnicas haciendo uso del servicio
	getAreasTecnicas() {
    this.areaService.getAreasTecnicas()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
			resp => {
				this.areasTecnicas = resp;
      });
  }

  // Metodo para obtener todas las Unidades academica administrativas usando el metodo getUnidades del servicio.
	getUnidades() {
    this.unidadService.getUnidades()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      resp => {
        this.unidades = resp;
      });
	}

  //Metodo para guardar o actualizar la información en la base de datos.
  onSubmit(form: NgForm) {
    if(form.invalid){return;}
    this.swal.showLoading();
    for (let i in this.usuario.perfil.roles) {
      if(this.usuario.perfil.roles[i] === false){
        delete this.usuario.perfil.roles[i];
      }
    }
    this.validarUsuario();
    this.usuarioService.updateUsuario(this.usuario).then(()=>{
      this.swal.stopLoading();
      this.swal.showSuccessMessage('');
    }).catch((error)=>{
      this.swal.stopLoading();
      this.swal.showErrorMessage('');
    });

  }

  getUnidad() {
    this.unidadService.getUnidad(this.usuario.unidad_id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( unidad => {
          // Se obtiene la información de la unidad desde la base de datos de firebase.
          this.unidad = unidad;
        });
  }

  getAreaTecnica() {
    this.areaService.getAreaTecnica(this.usuario.area_id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( areatecnica => {
          // Se obtiene la información del area técnica desde la base de datos de firebase.
          this.areatecnica = areatecnica;
        });
  }

  onChange(centroId) {
    this.perfilService.getPerfil(centroId)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( resp => {
			this.usuario.perfil = resp;

		});
  }

  // Metodo para verificar que cada usuario tenga la informaciòn adecuada.
    // EJ: Si se registra un usuario con el perfil solicitante, que no vaya a tener
    // asignado el atributo area_id porque un solicitante no pertenece a ningun area tecnica.
	validarUsuario() {
		// Si es solicitante
		if (this.usuario.perfil.nombre == 'Solicitante') {
      delete this.usuario.area_id;
    }
		// Si es UAA Asesora
      	else if (this.usuario.perfil.nombre == 'UAA Asesora') {
          delete this.usuario.unidad_id;
        }
      	else {
			delete this.usuario.area_id; delete this.usuario.unidad_id; } // Si no es ni un solicitante ni una UAA Asesora, elimino las propiedades area_id y unidad_id
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
