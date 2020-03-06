import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Componentes
import { CompleteTaskComponent } from '../../general/complete-task.component';

// Modelos
import { MyProcessData } from '../../../models/MyProcessData';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';

@Component({
  selector: 'approveDataTask',
  templateUrl: './approveDataTask.component.html',
  styleUrls: []
})
export class approveDataTaskComponent extends CompleteTaskComponent {
  submitted = false;
  model = new MyProcessData([], [], [], '', false);

  constructor(route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService) {
    super(route, router, camundaRestService);
    this.route.params.subscribe(params => {
      const taskId = params['taskId'];
      const variableNames = Object.keys(this.model).join(',');
      this.loadExistingVariables(taskId, variableNames);
    });
  }

}
