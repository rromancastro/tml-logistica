import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatLabel',
  standalone: true
})
export class FormatLabelPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    // Reemplazar guion bajo por espacio
    let formattedValue = value.replace(/_/g, ' ');
    // Convertir a titlecase
    formattedValue = formattedValue.split(' ')
                                   .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                   .join(' ');
    return formattedValue;
  }

}
