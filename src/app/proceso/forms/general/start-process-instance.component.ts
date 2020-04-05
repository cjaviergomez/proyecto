import { OnInit, OnDestroy } from '@angular/core';
import { CamundaRestService } from '../../services/camunda-rest.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Modelos
import { Solicitud } from '../../../solicitudes/models/solicitud';
import { Usuario } from '../../../admin/models/usuario';
import { Unidad } from 'app/admin/models/unidad';
import { Material } from '../../models/material';
import { MyProcessData } from '../../models/MyProcessData';
import { Notificacion } from 'app/in/models/notificacion';

//Servicios
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { MaterialesService } from '../../services/materiales.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';
import { NotificacionService } from '../../services/notificacion.service';

export class StartProcessInstanceComponent implements OnInit, OnDestroy {
  solicitud;
  usuario: Usuario;
  unidad:Unidad; // Unidad academica a la cual pertenece el usuario
  materiales: Material[]; //Materiales encontrados en la base de datos.
  materialesUsuario: Material[]; //Materiales que agrega el usuario.
  elementosPro: Material[]; // Elementos de protección encontrados en la base de datos.
  elementosUsuario: Material[]; // Elementos de protección que agrega el usuario.
  especiales: Material[]; // Acciones especiales encontradas en la base de datos.
  especialesUsuario: Material[]; // Acciones especiales

  authService: AuthService
  usuarioService: UsuarioService
  solicitudService: SolicitudService
  unidadService: UnidadService
  datePipe: DatePipe
  materialService: MaterialesService
  swal: ShowMessagesService
  notificacionService: NotificacionService

  filterPost = ''; // Texto a buscar en los materiales.
  filterElements = ''; // Texto a buscar en los elementos de protección.
  filterEspecials = ''; // Texto a buscar en los especiales.

  seccion;
  processDefinitionKey;
  idCapa;
  edif;
  idSubCapa;
  subCapa;
  elem;
  piso;
  idProcess;
  fecha_actual
  hora
  descripcionS
  url = '';
  name = '';

  model: MyProcessData;
  submitted = false;
  cargando
  route: ActivatedRoute
  camundaRestService: CamundaRestService

  //Para trabajar con las notificaciones
  notificacion: Notificacion;

  public ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(route: ActivatedRoute,
    camundaRestService: CamundaRestService,
    authService: AuthService,
    usuarioService: UsuarioService,
    solicitudService: SolicitudService,
    unidadService: UnidadService,
    datePipe: DatePipe,
    materialService: MaterialesService,
    swal: ShowMessagesService,
    notificacionService: NotificacionService
    ) {
      this.cargando = true; //Indicador para saber cuando la información necesaria para el formulario a cargado.
      this.route = route;
      this.camundaRestService = camundaRestService;
      this.authService = authService;
      this.usuarioService = usuarioService;
      this.solicitudService = solicitudService;
      this.unidadService = unidadService;
      this.datePipe = datePipe;
      this.materialService = materialService;
      this.swal = swal;
      this.notificacionService = notificacionService;
  }

  ngOnInit() {

    this.materialesUsuario = [];
    this.elementosUsuario = [];
    this.especialesUsuario = [];
    this.seccion = 1;

    this.fecha_actual = new Date();
		this.hora = this.fecha_actual.toLocaleTimeString('en-US', {hour12:true, hour:'numeric', minute: 'numeric'});
    this.fecha_actual = this.datePipe.transform(this.fecha_actual, 'dd/MM/yyyy');

    this.authService.estaAutenticado()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( user => {
          if(user){
            this.usuarioService.getUsuario(user.uid)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((usuario: Usuario) => {
                  // Obtenemos la información del usuario de la base de datos de firebase.
                  this.usuario = usuario;
                  this.getUnidad(this.usuario.unidad_id);
                });
          }
        });
    this.route.params.subscribe(params => {
      this.processDefinitionKey = params['processdefinitionkey'];
      this.idCapa = params['idCapa']; // Se obtiene el id por la url
      this.edif = params['edif']; // Se obtiene el id por la url
      this.idSubCapa = params['idSubCapa'];
      this.subCapa = params['subCapa'];
      this.elem = params['elem'];
      this.piso = params['piso'];

      this.solicitud = {
        fecha: this.fecha_actual,
        hora: this.hora,
        usuario: {
          ...this.usuario
        }
      };
    });
  }
  onSubmit() {
    this.swal.showLoading();
    const variables = this.generateVariablesFromFormFields();
    this.camundaRestService.postProcessInstance(this.processDefinitionKey, variables).subscribe( data =>{
      this.idProcess = data.id;
      this.solicitud = {
        estado: 'Pendiente',
        nombre_edificio: this.edif,
        piso_edificio: this.piso,
        fecha: this.fecha_actual,
        idSubCapa: this.idSubCapa,
        nombre_subcapa: this.subCapa,
        idEdificio: this.idCapa,
        objectID: this.elem,
        hora: this.hora,
        usuario: {
          ...this.usuario
        },
        idProcess: this.idProcess,
        descripcion: this.descripcionS,
        urlDocumentos: this.url,
        nombreDocumentos: this.name
      };

      this.solicitudService.addSolicitud(this.solicitud).then((data) => {
        const id = Math.random().toString(36).substring(2);
        this.notificacion = {
          id: id,
          leido: false,
          solicitudId: data.id,
          texto: 'ha creado una nueva solicitud.',
          actor: this.usuario.nombres,
          fecha: new Date()
        };
        this.notificacionService.notifyPlaneacion(this.notificacion);
        if(this.usuario.perfil.nombre !== 'Planta Física'){
          this.notificacionService.notifyPlantaFisica(this.notificacion);
        }
        this.submitted = true;
        this.swal.stopLoading();
      }).catch(error=>{
        this.swal.stopLoading();
      });
    });

  }
  generateVariablesFromFormFields() {
    this.model.materiales = this.materialesUsuario;
    this.model.elementosProteccion = this.elementosUsuario;
    this.model.especiales = this.especialesUsuario;
    const variables = {
      variables: { }
    };
    Object.keys(this.model).forEach((field) => {
      variables.variables[field] = {
        value: this.model[field]
      };
    });

    return variables;
  }

  seccionSiguiente(){
		this.seccion = this.seccion + 1;
	}

	seccionAnterior(){
		this.seccion = this.seccion - 1;
	}

	actualSeccion(sesion:number){
		this.seccion = sesion;
  }

  //Metodo para obtener la Unidad academica administrativa del usuario usando el metodo getUnidad del servicio.
	getUnidad( id: string){
		this.unidadService.getUnidad(id).subscribe( unidad => {
      this.unidad = unidad;
      this.cargando = false;
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
