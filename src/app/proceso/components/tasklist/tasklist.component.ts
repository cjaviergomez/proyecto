import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CamundaRestService } from '../../services/camunda-rest.service';
import { Task } from '../../models/Task';

// Iconos
import { faExclamation, faSyncAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  tasks: Task[] = null;
  processId: string;
  taskId: string;
  formKey: string;
  cargando = false;

  faExclamation = faExclamation; // Icono de exclamación.
  faSyncAlt = faSyncAlt; // Icono que da vueltas al cargar.

  constructor(
    private camundaRestService: CamundaRestService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['id'] != null && params['taskId'] == null) {
          this.processId = params['id'];
          this.getTasks();
        } else if(params['id'] != null && params['taskId'] != null){
          this.taskId = params['taskId'];
          this.getFormKey();
        }
      });
    }
  }

  getFormKey(): void {
    this.camundaRestService
      .getTaskFormKey(this.taskId)
      .subscribe(formKey => this.formKey = formKey.key);
  }

  getTasks(): void {
    this.camundaRestService
      .getTasksProcess(this.processId)
      .subscribe(tasks => {
        this.tasks = tasks;
        this.cargando = false;
      });
  }

}
