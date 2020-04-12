import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faUsers } from '@fortawesome/free-solid-svg-icons'; // Iconos

// Componente padre
import { ComunTaskComponent } from '../../general/comun-task.component';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { UsuarioService } from '../../../../admin/services/usuario.service';
import { AuthService } from '../../../../out/services/auth.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';
import { ShowMessagesService } from '../../../../out/services/show-messages.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';

@Component({
	selector: 'app-iniciar-obra',
	templateUrl: './iniciar-obra.component.html',
	styleUrls: ['./iniciar-obra.component.css']
})
export class iniciarObraComponent extends ComunTaskComponent implements OnInit, OnDestroy {
	faUsers = faUsers;
	interventorId: string;

	constructor(
		route: ActivatedRoute,
		router: Router,
		camundaRestService: CamundaRestService,
		solicitudService: SolicitudService,
		swal: ShowMessagesService,
		usuarioService: UsuarioService,
		authService: AuthService,
		notificacionService: NotificacionService
	) {
		super(
			route,
			router,
			camundaRestService,
			solicitudService,
			swal,
			usuarioService,
			authService,
			notificacionService
		);
	}

	/**
	 * Este método forma parte del ciclo de vida del componente y
	 * se ejecuta tan pronto se inicia el componente.
	 */
	ngOnInit(): void {
		this.metodoInicial();
	}
}
