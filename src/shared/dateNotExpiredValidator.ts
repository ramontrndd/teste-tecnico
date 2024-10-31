import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateNotExpiredValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove horas, minutos, segundos e milissegundos

    // Verifica se a data selecionada é anterior à data atual
    return selectedDate < today ? { 'dateExpired': true } : null;
  };
}
