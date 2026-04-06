import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Footer } from '../../footer/footer';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-novedades-page',
  imports: [Navbar, Footer, RouterLink],
  templateUrl: './novedades-page.html',
  styleUrl: './novedades-page.scss',
})
export class NovedadesPage {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  noticia: Noticia | null = null;
  otrasNoticias: Noticia[] = [];
  loading = true;
  error = false;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const idNovedad = params.get('id_novedad');

      this.loading = true;
      this.error = false;
      this.noticia = null;
      this.otrasNoticias = [];

      this.http.get<Noticia[]>('/noticias.json').subscribe({
        next: (response) => {
          this.noticia = response.find((item) => item.id_novedad === idNovedad) ?? null;
          this.otrasNoticias = response.filter((item) => item.id_novedad !== idNovedad);
          this.error = !this.noticia;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
    });
  }
}

interface Noticia {
  id_novedad: string;
  titulo: string;
  fecha: string;
  actualizado: string;
  descripcion: string;
  imagen: string;
  imagenMini: string;
  link: string;
}
