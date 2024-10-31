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
    const value = Number(numericValue) / 100;
    // Verifica se o valor excede 100 milhões
    if (value > 100_000_000) {
      this.el.nativeElement.value = this.formatCurrency((100_000_000 * 100).toString());
      this.onChange(100_000_000); // Define o valor como 100 milhões
    } else {
      this.onChange(value); // Chama a função onChange com o valor formatado
      this.el.nativeElement.value = this.formatCurrency(numericValue); // Exibe o valor formatado
    }
  }
  @HostListener('blur') // Adiciona um listener para o evento de blur
  onBlur() {
    const value = this.el.nativeElement.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (!value) {
      this.onChange(null); // Define como nulo se o campo estiver vazio
    }
    this.onTouched(); // Chama a função onTouched para marcar o campo como tocado
  }
  private formatCurrency(value: string): string {
    if (!value) return ''; // Retorna vazio se não houver valor
    const numericValue = Number(value) / 100;
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
  // Métodos do ControlValueAccessor
  writeValue(value: any): void {
    // Se o valor for nulo ou zero, limpa o campo
    const numericValue = value != null && value !== 0 ? (value * 100).toString() : '';
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
