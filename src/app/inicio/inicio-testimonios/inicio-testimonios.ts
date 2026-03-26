import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio-testimonios',
  imports: [],
  templateUrl: './inicio-testimonios.html',
  styleUrl: './inicio-testimonios.scss',
})
export class InicioTestimonios {
  readonly slides = [
    {
      quote:
        `"Como socios estratégicos hemos desarrollado la marca en la Argentina de la mano de TML.”`,
      author: 'Roche Argentina',
      role: 'Roche Argentina',
    },
    {
      quote:
        '"Estamos todos muy agradecidos en Motiva con el servicio que nos dieron desde el inicio. Fueron parte fundamental en este crecimiento. Siempre estuvieron dispuestos a todas las locuras que planteamos."',
      author: 'Motiva Argentina',
      role: 'Motiva Argentina',
    },
    {
      quote:
        '"Netshop va a seguir creciendo y vamos a seguir utilizando a TML como nuestro operador logístico. Resuelven todo enseguida y correctamente."',
      author: 'Netshop Group',
      role: 'Netshop Group',
    },
    {
      quote:
        '"Los recomiendo siempre. Venimos de otra logística que era un caos siempre y aca es un placer trabajar. Siempre tengo respuestas para todo."',
      author: 'World Market SRL',
      role: 'World Market SRL',
    },
  ];

  currentIndex = 0;

  previousSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}
