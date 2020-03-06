import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';

@Component({
  selector: 'app-revisar-solicitud',
  templateUrl: './revisarSolicitud.component.html',
  styleUrls: ['./revisarSolicitud.component.css']
})
export class revisarSolicitudComponent implements OnInit {

  constructor(private camundaRestService: CamundaRestService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

  }

  completarTarea() {
    this.route.params.subscribe(params => {
      const procesoId = params['id'];
      const taskId = params['taskId'];
      this.camundaRestService.postCompleteTask(taskId, {}).subscribe(()=>{
        this.router.navigate(['/modProceso/tasklist', procesoId]);
      });
    });
  }

}
