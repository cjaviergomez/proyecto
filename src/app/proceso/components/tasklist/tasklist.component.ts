import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CamundaRestService } from '../../services/camunda-rest.service';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  tasks: Task[] = null;
  taskId: String;
  formKey: String;

  constructor(
    private camundaRestService: CamundaRestService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getTasks();
    if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['id'] != null) {
          this.taskId = params['id'];
          this.getFormKey();
        } else {
          this.getTasks();
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
      .getTasksProcess('244e51b6-447b-11ea-8ea4-9cb654491430')
      .subscribe(tasks => this.tasks = tasks);
  }

}