import { CamundaRestService } from '../../services/camunda-rest.service';
import { AuthService } from '../../../out/services/auth.service';
import { ActivatedRoute } from '@angular/router';
// Modelos
import { Solicitud } from '../../../solicitudes/models/solicitud';
import { Usuario } from '../../../admin/models/usuario';

//Servicios
import { UsuarioService } from '../../../admin/services/usuario.service';
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';

export class StartProcessInstanceComponent {
  solicitud: Solicitud;
  usuario: Usuario;
  authService: AuthService
  usuarioService: UsuarioService
  solicitudService: SolicitudService

  idCapa;
  edif;
  subCapa;
  elem;
  piso;
  idProcess;

  model
  submitted
  route: ActivatedRoute
  camundaRestService: CamundaRestService

  constructor(route: ActivatedRoute,
    camundaRestService: CamundaRestService,
    authService: AuthService,
    usuarioService: UsuarioService,
    solicitudService: SolicitudService
    ) {
      this.route = route;
      this.camundaRestService = camundaRestService;

      this.authService = authService;
      this.usuarioService = usuarioService;
      this.solicitudService = solicitudService;
  }
  onSubmit() {
    this.route.params.subscribe(params => {
      const processDefinitionKey = params['processdefinitionkey'];
      this.idCapa = params['idCapa']; // Se obtiene el id por la url
      this.edif = params['edif']; // Se obtiene el id por la url
      this.subCapa = params['subCapa'];
      this.elem = params['elem'];
      this.piso = params['piso'];

      const variables = this.generateVariablesFromFormFields();
      this.camundaRestService.postProcessInstance(processDefinitionKey, variables).subscribe(data=>{
        this.idProcess = data.id;
        this.authService.estaAutenticado()
          .subscribe( user => {
            if(user){
              this.usuarioService.getUsuario(user.uid)
                  .subscribe((usuario: Usuario) => {
                    // Obtenemos la información del usuario de la base de datos de firebase.
                    this.usuario = usuario;
                    this.solicitud = {
                      estado: 'Pendiente',
                      nombre_edificio: this.edif,
                      piso_edificio: this.piso,
                      usuario: {
                        ...this.usuario
                      },
                      nombre_subcapa: this.subCapa,
                      objectID: this.elem,
                      idProcess: this.idProcess
                    }

                    this.solicitudService.addSolicitud(this.solicitud).then(()=>{
                      this.submitted = true;
                      console.log('SOlicitud creada');
                    }).catch(error=>{
                      console.log(error);
                    });
                  });
            }
          });
      });
    });

  }
  generateVariablesFromFormFields() {
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

  irSolicitudes(){

  }
}
