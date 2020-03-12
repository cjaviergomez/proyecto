import { CamundaRestService } from '../../services/camunda-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';
import { MaterialesService } from '../../services/materiales.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';

export class CompleteTaskComponent {
  model
  route: ActivatedRoute
  router: Router
  camundaRestService: CamundaRestService
  solicitudService: SolicitudService
  unidadService: UnidadService
  swal: ShowMessagesService
  materialService: MaterialesService
  usuarioService: UsuarioService
  authService: AuthService

  constructor(route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    solicitudService: SolicitudService,
    unidadService: UnidadService,
    swal: ShowMessagesService,
    materialService: MaterialesService,
    usuarioService: UsuarioService,
    authService: AuthService
    ) {
      this.route = route;
      this.router = router;
      this.camundaRestService = camundaRestService;
      this.solicitudService = solicitudService;
      this.unidadService = unidadService;
      this.swal = swal;
      this.materialService = materialService;
      this.usuarioService = usuarioService;
      this.authService = authService;
  }
  onSubmit() {
    this.route.params.subscribe(params => {
      const procesoId = params['id'];
      const taskId = params['taskId'];
      const variables = this.generateVariablesFromFormFields();
      this.camundaRestService.postCompleteTask(taskId, variables).subscribe(()=>{
        this.router.navigate(['/modProceso/tasklist', procesoId]);
      });
    });
  }

  loadExistingVariables(taskId: String, variableNames: String) {
    this.camundaRestService.getVariablesForTask(taskId, variableNames).subscribe((result) => {
      this.generateModelFromVariables(result);
    });
  }
  generateModelFromVariables(variables) {
    Object.keys(variables).forEach((variableName) => {
      this.model[variableName] = variables[variableName].value;
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
