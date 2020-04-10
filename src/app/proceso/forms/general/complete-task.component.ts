import { ActivatedRoute, Router } from '@angular/router';

//Services
import { CamundaRestService } from '../../services/camunda-rest.service';
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';
import { MaterialesService } from '../../services/materiales.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';

// Modelos
import { MyProcessData } from 'app/proceso/models/MyProcessData';

export class CompleteTaskComponent {
	model = new MyProcessData([], [], [], '', false);
	route: ActivatedRoute;
	router: Router;
	camundaRestService: CamundaRestService;
	solicitudService: SolicitudService;
	unidadService: UnidadService;
	swal: ShowMessagesService;
	materialService: MaterialesService;
	usuarioService: UsuarioService;
	authService: AuthService;

	constructor(
		route: ActivatedRoute,
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
	onSubmit(): void {
		this.route.params.subscribe((params) => {
			const procesoId = params['id'];
			const taskId = params['taskId'];
			const variables = this.generateVariablesFromFormFields();
			this.camundaRestService.postCompleteTask(taskId, variables).subscribe(() => {
				this.router.navigate(['/modProceso/tasklist', procesoId]);
			});
		});
	}

	loadExistingVariables(taskId: string, variableNames: string): void {
		this.camundaRestService.getVariablesForTask(taskId, variableNames).subscribe((result) => {
			this.generateModelFromVariables(result);
		});
	}
	generateModelFromVariables(variables): void {
		Object.keys(variables).forEach((variableName) => {
			this.model[variableName] = variables[variableName].value;
		});
	}

	generateVariablesFromFormFields() {
		const variables = {
			variables: {},
		};
		Object.keys(this.model).forEach((field) => {
			variables.variables[field] = {
				value: this.model[field],
			};
		});

		return variables;
	}
}
