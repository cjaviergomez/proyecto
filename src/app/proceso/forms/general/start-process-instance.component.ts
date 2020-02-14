import { OnInit } from '@angular/core';
import { CamundaRestService } from '../../services/camunda-rest.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

// Modelos
import { Solicitud } from '../../../solicitudes/models/solicitud';
import { Usuario } from '../../../admin/models/usuario';
import { Unidad } from 'app/admin/models/unidad';
import { Material } from '../../models/material';
import { MyProcessData } from '../../models/MyProcessData';

//Servicios
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { MaterialesService } from '../../services/materiales.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

export class StartProcessInstanceComponent implements OnInit {
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

  filterPost = ''; // Texto a buscar en los materiales.
  filterElements = ''; // Texto a buscar en los elementos de protección.
  filterEspecials = ''; // Texto a buscar en los especiales.

  seccion;
  processDefinitionKey;
  idCapa;
  edif;
  subCapa;
  elem;
  piso;
  idProcess;
  fecha_actual
  hora
  descripcionS

  model: MyProcessData;
  submitted
  cargando
  route: ActivatedRoute
  camundaRestService: CamundaRestService

  constructor(route: ActivatedRoute,
    camundaRestService: CamundaRestService,
    authService: AuthService,
    usuarioService: UsuarioService,
    solicitudService: SolicitudService,
    unidadService: UnidadService,
    datePipe: DatePipe,
    materialService: MaterialesService,
    swal: ShowMessagesService
    ) {
      this.cargando = true; //Indicador para saber cuando la información necesario para el formulario a cargado.
      this.route = route;
      this.camundaRestService = camundaRestService;
      this.authService = authService;
      this.usuarioService = usuarioService;
      this.solicitudService = solicitudService;
      this.unidadService = unidadService;
      this.datePipe = datePipe;
      this.materialService = materialService;
      this.swal = swal;

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
          .subscribe( user => {
            if(user){
              this.usuarioService.getUsuario(user.uid)
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
        hora: this.hora,
        usuario: {
          ...this.usuario
        },
        nombre_subcapa: this.subCapa,
        objectID: this.elem,
        idProcess: this.idProcess,
        descripcion: this.descripcionS
      };

      this.solicitudService.addSolicitud(this.solicitud).then(()=>{
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

}
