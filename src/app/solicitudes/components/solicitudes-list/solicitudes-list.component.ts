import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicios
import { SolicitudService } from '../../services/solicitud.service';

// Modelos
import { Solicitud } from '../../models/solicitud';

// Iconos
import { faSearchPlus, faExclamation, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'solicitudes-list',
	templateUrl: './solicitudes-list.component.html',
	styleUrls: ['./solicitudes-list.component.css']
})
export class SolicitudesListComponent implements OnInit, OnDestroy {
	public titulo = 'Solicitudes';
	public solicitudes: Solicitud[];
	cargando = false;
	private ngUnsubscribe: Subject<any> = new Subject<any>();
	// Icons
	faSearchPlus = faSearchPlus; // Icono a implementar en el botón de borrar.
	faExclamation = faExclamation; // Icono de exclamación.
	faSyncAlt = faSyncAlt; // Icono que da vueltas al cargar.

	constructor(private solicitudService: SolicitudService) {}

	ngOnInit(): void {
		this.getSolicitudes();
	}

	//Metodo para obtener todas las solicitudes usando el metodo getSolicitudes del servicio.
	getSolicitudes(): void {
		this.cargando = true;
		this.solicitudService
			.getSolicitudes()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((solicitudes) => {
				this.solicitudes = solicitudes;
				this.cargando = false;
			});
	}

	// onDeleteSolicitud(id: number): void {}

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
