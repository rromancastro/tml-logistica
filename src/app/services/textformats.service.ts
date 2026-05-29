import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextformatsService {

  formatForUrl(location: string): string {
    return location
      .trim()
      .toLowerCase()
      .replace(/\./g, '')           // quita puntos
      .replace(/\s*-\s*/g, '-')     // reemplaza " - " o "-" por un solo guión
      .replace(/\s+/g, '-')         // espacios por guión
      .replace(/[^a-z0-9-]/g, '');  // quita todo lo que no sea letras, números o guiones
  }
  
  findLocationByUrlFragment(fragment: string, lista: any[]): any | null {
    const normalizar = (s: string) =>
      s.trim()
       .toLowerCase()
       .replace(/\./g, '')
       .replace(/\s*-\s*/g, '-')
       .replace(/\s+/g, '-')
       .replace(/[^a-z0-9-]/g, '');
  
    return lista.find(item => normalizar(item.location) === fragment) || null;
  }


  formatTitle(name: string): string {
    return this.capitalizarPrimeraLetra(name)
      .trim() // Elimina espacios al inicio y final
      .replace('-', ' ') // Reemplaza espacios con %20
  }
  
  capitalizarPrimeraLetra(texto:string) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  replaceNbsp(contenido: string): string {
    if (!contenido) return '';

    const sinEstilos = contenido.replace(/<strong[^>]*style="[^"]*"[^>]*>/g, '<strong>');
    const sinEspacios = sinEstilos.replace(/&nbsp;/g, ' ');
    const sinParrafosVacios = sinEspacios.replace(/<p><\/p>/g, '<br/><br/>');

    return sinParrafosVacios;
  } 

  limpiarHtml(html: string): string {
    return html.replace(/&nbsp;/g, ' ');
  }
  constructor() { }
}
