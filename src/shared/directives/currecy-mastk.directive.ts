import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true
    }
  ]
})
export class CurrencyMaskDirective implements ControlValueAccessor {
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;

    // Remove qualquer caractere não numérico e converte para número puro
    const numericValue = initialValue.replace(/\D/g, '');
    this.onChange(Number(numericValue) / 100);

    // Exibe o valor formatado com moeda para o usuário
    this.el.nativeElement.value = this.formatCurrency(numericValue);
  }

  private formatCurrency(value: string): string {
    const numericValue = Number(value) / 100;
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
  // Métodos do ControlValueAccessor
  writeValue(value: any): void {
    const numericValue = value ? value.toString().replace(/\D/g, '') : '0';
    this.el.nativeElement.value = this.formatCurrency(numericValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}
