import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject, Injectable, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  public _snackBar = inject(MatSnackBar);
  public carpeta = "https://bamp.com.ar/admin/";
  //public carpeta = "https://caliopecoro.com.ar";
  /*public carpeta = "http://localhost/dawepro/public";  ONLINE */
    
  constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private sanitizer: DomSanitizer
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
    });
  }
    
  copyToClipboard(url: string): void {
    if (isPlatformBrowser(this.platformId)) { // Verifica que está en el navegador
      navigator.clipboard.writeText(url)
        .then(() => {
          this.openSnackBar('URL copiada al portapapeles: '+url, 'Ok');
        })
        .catch(err => console.error('Error al copiar:', err));
    } else {
      console.warn('Intento de copiar en un entorno SSR, se ha bloqueado.');
    }
  }
  
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
  extension(value: string){
    //console.log(value.slice(-3).toLowerCase());
    return value.slice(-3).toLowerCase();
  }

  separarPorComas(value: string | string[], separator: string = ','): string[] {
    if (Array.isArray(value)) {
      return value; // Si ya es un array, lo devuelve tal cual
    }
    return value ? value.split(separator).map(item => item.trim()) : [];
  }
  
  obtenerNombreArchivo(url: string): string {
    // Eliminar los últimos 4 caracteres (la extensión)
    const urlSinExtension = url.slice(0, -4);
    
    // Buscar la última aparición de "/" en la cadena sin extensión
    const indiceUltimaBarra = urlSinExtension.lastIndexOf('/');
    
    // Si se encontró la barra, extraer el nombre del archivo
    if (indiceUltimaBarra !== -1) {
      return urlSinExtension.substring(indiceUltimaBarra + 1);
    }
    
    // Si no hay "/" se retorna la cadena completa sin extensión
    return urlSinExtension;
  }
  

}
