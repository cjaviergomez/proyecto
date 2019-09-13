import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Component({
	selector: 'home',
	templateUrl: '../views/home.html'
})
export class HomeComponent{
	public titulo: string;

	constructor(private auth: AuthService){
		this.titulo = 'Página Principal';
	}

	ngOnInit(){
		console.log('Se ha cargado el componente home.component.ts');
	}

}
