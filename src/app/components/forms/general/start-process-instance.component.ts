import { CamundaRestService } from '../../../services/camunda-rest.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
// Modelos
import { Solicitud } from '../../../models/solicitud';
import { Usuario } from '../../../models/usuario';
import { SolicitudService } from '../../../services/solicitud.service';

export class StartProcessInstanceComponent {
  solicitud: Solicitud;
  usuario: Usuario;
  authService: AuthService
  usuarioService: UsuarioService
  solicitudService: SolicitudService

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
      const variables = this.generateVariablesFromFormFields();
      this.camundaRestService.postProcessInstance(processDefinitionKey, variables).subscribe();
      this.submitted = true;

      this.authService.estaAutenticado()
          .subscribe( user => {
            if(user){
              this.usuarioService.getUsuario(user.uid)
                  .subscribe((usuario: Usuario) => {
                    // Obtenemos la información del usuario de la base de datos de firebase.
                    this.usuario = usuario;
                  });
            }
          });
      this.solicitud = {
        estado: 'Pendiente',
        nombre_edificio: 'Ingeniería Mecánica',
        piso_edificio: 4,
        usuario: this.usuario
      }
      this.solicitudService.addSolicitud(this.solicitud);

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
}
