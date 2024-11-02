import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true,
    },
  ],
})
export class CurrencyMaskDirective implements ControlValueAccessor {
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  // Listener para o evento de input
  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    const numericValue = initialValue.replace(/\D/g, '');
    const value = Number(numericValue) / 100;

    // Verifica se o valor excede 100 milhões
    if (value > 100_000_000) {
      this.el.nativeElement.value = this.formatCurrency(
        (100_000_000 * 100).toString()
      );
      this.onChange(100_000_000); // Define o valor como 100 milhões
    } else {
      this.onChange(value); // Chama a função onChange com o valor formatado
      this.el.nativeElement.value = this.formatCurrency(numericValue); // Exibe o valor formatado
    }
  }

  // Listener para o evento de blur
  @HostListener('blur')
  onBlur() {
    const value = this.el.nativeElement.value.replace(/\D/g, '');
    if (!value) {
      this.onChange(null); // Define como nulo se o campo estiver vazio
    }
    this.onTouched(); // Marca o campo como tocado
  }

  // Formata o valor para o formato de moeda brasileiro
  private formatCurrency(value: string): string {
    if (!value) return '';
    const numericValue = Number(value) / 100;
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  // Método do ControlValueAccessor para escrever o valor no campo
  writeValue(value: any): void {
    const numericValue =
      value != null && value !== 0 ? (value * 100).toString() : '';
    this.el.nativeElement.value = this.formatCurrency(numericValue);
  }

  // Método do ControlValueAccessor para registrar a função onChange
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Método do ControlValueAccessor para registrar a função onTouched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Método do ControlValueAccessor para definir o estado de desabilitado
  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}
