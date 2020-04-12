import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faSyncAlt, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services
import { SolicitudService } from '../../services/solicitud.service';

// Models
import { Solicitud } from '../../models/solicitud';

@Component({
	selector: 'solicitud-detail',
	templateUrl: './solicitud-detail.component.html',
	styleUrls: ['../solicitudes-list/solicitudes-list.component.css']
})
export class SolicitudDetailComponent implements OnInit, OnDestroy {
	public solicitud: Solicitud;
	cargando: boolean;
	private ngUnsubscribe: Subject<any> = new Subject<any>(); // Observable para desubscribir todos los observables
	faSyncAlt = faSyncAlt;
	faExclamation = faExclamation;

	constructor(private solicitudService: SolicitudService, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.cargando = true;
		this.getSolicitud();
	}

	getSolicitud(): void {
		this.route.params.forEach((params: Params) => {
			const id = params['id'];
			this.solicitudService
				.getSolicitud(id)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe((solicitud) => {
					this.solicitud = solicitud;
					this.cargando = false;
				});
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
