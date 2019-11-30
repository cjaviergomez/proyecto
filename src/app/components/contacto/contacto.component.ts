import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

// Modelos
import { Mensaje } from '../../models/mensaje';

//Servicios
import { MensajesService } from '../../services/mensajes.service';
import { ShowMessagesService } from '../../services/show-messages.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  mensaje: Mensaje = new Mensaje();
  fecha: Date = new Date();

  constructor(private mensajesService: MensajesService,
              private swal: ShowMessagesService) { }

  ngOnInit() {
    console.log(this.fecha.getDate());
  }

  onSubmit(form: NgForm){
    if(form.invalid) {return;}

    //TODO: Falta validar que el usuario solo pueda enviar un mensaje por día.
    this.swal.showLoading();
    this.mensaje.fecha = this.fecha.getDate();
    this.mensaje.estado = 'Pendiente';
    this.mensajesService.addMensaje(this.mensaje).then(()=>{
      this.swal.stopLoading();
      this.swal.showSuccessMessage('sendMessage');
    });
  }

}
