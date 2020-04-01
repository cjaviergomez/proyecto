import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaNotificacion'
})
export class FechaNotificacionPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let secondsNow = Math.floor(Date.now() / 1000);
    let diferenSeconds = secondsNow - value.seconds;
    if(diferenSeconds < 60) {
      return Math.trunc(diferenSeconds) + ' segundos';
    }else if(diferenSeconds >= 60 && diferenSeconds < 3600){
      return Math.trunc(diferenSeconds/60) + ' minutos';
    } else if(diferenSeconds >= 3600 && diferenSeconds < 86400){
      return Math.trunc(diferenSeconds/(60*60)) + ' horas';
    } else if(diferenSeconds >= 86400){
      return Math.trunc(diferenSeconds/(60*60*24)) + ' días';
    }
  }

}
