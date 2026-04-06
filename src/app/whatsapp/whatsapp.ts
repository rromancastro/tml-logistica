import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-whatsapp',
  imports: [],
  templateUrl: './whatsapp.html',
  styleUrl: './whatsapp.scss',
})
export class Whatsapp {
  mostrarDrop: boolean = false;

  constructor(private elementRef: ElementRef) {}

  handleMostrarDrop(): void {
    this.mostrarDrop = !this.mostrarDrop;
  }
  
  @HostListener('document:click', ['$event'])
  clickFuera(event: MouseEvent): void {
    const clicDentro = this.elementRef.nativeElement.contains(event.target);

    if (!clicDentro) {
      this.mostrarDrop = false;
    }
  }
}
