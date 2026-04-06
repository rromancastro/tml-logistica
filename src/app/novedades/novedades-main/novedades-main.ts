import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-novedades-main',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './novedades-main.html',
  styleUrl: './novedades-main.scss',
})
export class NovedadesMain {
  private readonly http = inject(HttpClient);

  noticias: Noticia[] = [];
  loading = true;
  error = false;

  constructor() {
    this.http.get<Noticia[]>('/noticias.json').subscribe({
      next: (response) => {
        this.noticias = response;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
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
  link: string;
}
