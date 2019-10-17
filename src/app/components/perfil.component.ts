import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

//Servicios
import { AuthService } from '../services/auth.service';
// Models
import { Usuario } from '../models/usuario';

@Component({
    selector: 'app-perfil',
    templateUrl: '../views/perfil.html',
    styleUrls: ['../../assets/css/perfil.css']
  })
export class PerfilComponent implements OnInit, OnDestroy {

    public providerId: string = 'null';
    private subcripcion: Subscription;
    usuario: Usuario = {
        nombres: '',
        correo: '',
        photoUrl: ''
    };

    constructor(private authService: AuthService){}
    
    ngOnInit() {
        this.subcripcion = this.authService.estaAutenticado().subscribe( user => {
            if (user) {
                this.usuario.nombres = user.displayName;
                this.usuario.correo = user.email;
                this.usuario.photoUrl = user.photoURL;
                this.providerId = user.providerData[0].providerId;
            }
        });
    }

   // Called once, before the instance is destroyed.
	ngOnDestroy(): void {
		if(this.subcripcion) {
			this.subcripcion.unsubscribe();
		}
	}



}