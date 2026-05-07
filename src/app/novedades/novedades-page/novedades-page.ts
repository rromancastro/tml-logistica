import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
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
  private readonly document = inject(DOCUMENT);
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

  getShareLinks(noticia: Noticia): ShareLinks {
    const shareUrl = this.getAbsoluteUrl(noticia);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(noticia.titulo);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      copy: shareUrl,
    };
  }

  private getAbsoluteUrl(noticia: Noticia): string {
    const origin = this.getSiteOrigin();
    return new URL(noticia.url ?? `/novedades/${noticia.id_novedad}`, origin).toString();
  }

  private getSiteOrigin(): string {
    const origin = this.document.location?.origin;
    const isLocalhost = origin ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) : false;

    return origin && !isLocalhost ? origin : 'https://www.tmlogistica.com.ar';
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
  url?: string;
}

interface ShareLinks {
  facebook: string;
  x: string;
  linkedin: string;
  copy: string;
}
