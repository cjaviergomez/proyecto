import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { faExclamation, faSyncAlt } from '@fortawesome/free-solid-svg-icons'; // Iconos

// Services
import { CamundaRestService } from '../../services/camunda-rest.service';
import { AuthService } from '../../../out/services/auth.service';

@Component({
	selector: 'app-processlist',
	templateUrl: './processlist.component.html',
	styleUrls: ['./processlist.component.css']
})
export class ProcesslistComponent implements OnInit, OnDestroy {
	public idCapa: string;
	public edif: string;
	public idSubCapa: string;
	public subCapa: string;
	public elem;
	public piso;

	public processDefinitions;
	private ngUnsubscribe: Subject<any> = new Subject<any>();
	public isCreador = null;

	cargando: boolean;
	faSyncAlt = faSyncAlt;
	faExclamation = faExclamation;

	constructor(
		private camundaRestService: CamundaRestService,
		private route: ActivatedRoute,
		private auth: AuthService
	) {}

	ngOnInit(): void {
		this.cargando = true;
		this.getCurrentUser();
		this.idCapa = this.route.snapshot.paramMap.get('idCapa'); // Se obtiene el id por la url
		this.edif = this.route.snapshot.paramMap.get('edif'); // Se obtiene el nombre del edificio por la url
		this.idSubCapa = this.route.snapshot.paramMap.get('idSubCapa');
		this.subCapa = this.route.snapshot.paramMap.get('subCapa');
		this.elem = this.route.snapshot.paramMap.get('elem');
		this.piso = this.route.snapshot.paramMap.get('piso');
	}

	getProcessDefinitions(): void {
		this.camundaRestService
			.getProcessDefinitions()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((processDefinitions) => {
				this.processDefinitions = processDefinitions;
				this.cargando = false;
			});
	}

	// Metodo para saber si hay un usuario logeado actualmente.
	getCurrentUser(): void {
		this.auth
			.estaAutenticado()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((user) => {
				if (user) {
					this.auth
						.isUserAdmin(user.uid)
						.pipe(takeUntil(this.ngUnsubscribe))
						.subscribe((userRole) => {
							this.getProcessDefinitions();
							if (userRole) {
								this.isCreador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('creador');
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
