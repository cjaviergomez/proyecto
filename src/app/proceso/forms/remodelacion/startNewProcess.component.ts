import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

// Componentes
import { StartProcessInstanceComponent } from '../general/start-process-instance.component'

// Modelos
import { MyProcessData } from '../../models/MyProcessData';
import { Solicitud } from 'app/solicitudes/models/solicitud';

// Servicios
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';
import { CamundaRestService } from '../../services/camunda-rest.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { MaterialesService } from 'app/proceso/services/materiales.service';

import { faWindowClose, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'startNewProcess',
  templateUrl: './startNewProcess.component.html',
  styleUrls: []
})
export class startNewProcessComponent extends StartProcessInstanceComponent {
  submitted:boolean = false;
  model = new MyProcessData();
  solicitud: Solicitud;
  faWindowClose = faWindowClose;
  faSearch = faSearch;

  constructor(route: ActivatedRoute, camundaRestService: CamundaRestService,
              authService: AuthService, usuarioService:UsuarioService,
              solicitudService: SolicitudService,
              unidadService: UnidadService,
              datePipe: DatePipe,
              materialService: MaterialesService) {
    super(route, camundaRestService, authService, usuarioService, solicitudService, unidadService, datePipe, materialService);
  }

  buscarMateriales() {
    if (this.filterPost.length === 0) {
      return;
    }
    this.materialService.getMaterial(this.filterPost).subscribe( materiales => {
      this.materiales = materiales;
      console.log('entró');
    });
  }

}
