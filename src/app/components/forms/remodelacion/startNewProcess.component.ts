import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { StartProcessInstanceComponent } from '../general/start-process-instance.component'
import { MyProcessData } from '../../../models/MyProcessData';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { SolicitudService } from '../../../services/solicitud.service';

@Component({
  selector: 'startNewProcess',
  templateUrl: './startNewProcess.component.html',
  styleUrls: []
})
export class startNewProcessComponent extends StartProcessInstanceComponent {
  submitted:boolean = false;
  model = new MyProcessData('','',false);

  constructor(route: ActivatedRoute, camundaRestService: CamundaRestService,
              authService: AuthService, usuarioService:UsuarioService, solicitudService: SolicitudService) {
    super(route, camundaRestService, authService, usuarioService, solicitudService);
  }

}
