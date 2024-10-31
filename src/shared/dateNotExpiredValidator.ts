import { AbstractControl, ValidatorFn } from '@angular/forms';
import  moment from 'moment';

export function dateNotExpiredValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDate = moment(control.value);

    // Fixar a data atual no dia anterior ao dia atual
    const now = moment().subtract(1, 'days');

    // Verifica se a data atual é anterior à data selecionada, incluindo horas, minutos e segundos
    if (now.isAfter(selectedDate)) {
      return { 'dateExpired': true };
    } else {
      return null;
    }
  };
}
