import { CamundaRestService } from '../../services/camunda-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';

export class CompleteTaskComponent {
  model
  submitted
  route: ActivatedRoute
  router: Router
  camundaRestService: CamundaRestService
  solicitudService: SolicitudService

  constructor(route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    solicitudService: SolicitudService
    ) {
      this.route = route;
      this.router = router;
      this.camundaRestService = camundaRestService;
      this.solicitudService = solicitudService;
  }
  onSubmit() {
    this.route.params.subscribe(params => {
      const procesoId = params['id'];
      const taskId = params['taskId'];
      const variables = this.generateVariablesFromFormFields();
      this.camundaRestService.postCompleteTask(taskId, variables).subscribe();
      this.submitted = true;
      this.router.navigate(['/modProceso/tasklist', procesoId]);
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
