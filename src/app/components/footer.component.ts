import { Component } from '@angular/core';

@Component({
	selector: 'app-footer',
	templateUrl: '../views/footer.html'
})
export class FooterComponent {
  public anio:number;

	constructor(){
    this.anio = new Date().getFullYear();
	}
}
